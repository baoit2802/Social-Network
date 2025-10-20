import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

// Tạo JWT
const createToken = (user) => {
    return jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
        },
        process.env.JWT_SECRET, { expiresIn: "1d" }
    );
};

export const registerUser = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email đã được sử dụng!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi đăng ký!" });
    }
};

export const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mật khẩu không đúng!" });

        const token = createToken(user);

        res.status(200).json({
            message: "Đăng nhập thành công!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar || null,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi đăng nhập!" });
    }
};

export const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản!" });

        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 phút
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/auth/reset-password.html?token=${resetToken}`;

        // Gửi email thật
        const html = `
      <h3>Khôi phục mật khẩu</h3>
      <p>Nhấn vào link dưới đây để đặt lại mật khẩu (hết hạn sau 15 phút):</p>
      <a href="${resetLink}">${resetLink}</a>
    `;
        await sendEmail(user.email, "Khôi phục mật khẩu - Social Network", html);

        res.status(200).json({
            message: "Liên kết đặt lại mật khẩu đã được gửi vào email của bạn.",
            resetLink,
        });
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi tạo liên kết!" });
    }
};

export const resetPassword = async(req, res) => {
    try {
        const { newPassword } = req.body;
        const token = req.params.token; // Lấy token từ URL params

        console.log("🔍 Reset Password Debug:");
        console.log("- Token from URL:", req.params.token);
        console.log("- Token from body:", req.body.token);
        console.log("- New password:", newPassword ? "provided" : "missing");
        console.log("- Current time:", new Date().toISOString());
        console.log("- Current timestamp:", Date.now());

        // Tìm user với token
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() },
        });

        console.log("- User found:", user ? "YES" : "NO");
        if (user) {
            console.log("- User email:", user.email);
            console.log("- Token expire time:", new Date(user.resetTokenExpire).toISOString());
            console.log("- Token expire timestamp:", user.resetTokenExpire);
            console.log("- Is token expired?", user.resetTokenExpire <= Date.now());
        }

        if (!user)
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        console.log("✅ Password reset successful for user:", user.email);
        res.status(200).json({ message: "Đặt lại mật khẩu thành công!" });
    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: "Lỗi máy chủ khi đặt lại mật khẩu!" });
    }
};

// 🟣 Lấy thông tin người dùng từ token
export const getUserInfo = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "Không tìm thấy user!" });

        res.status(200).json({ user });
    } catch (err) {
        console.error("Get user info error:", err);
        res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng!" });
    }
};

export const checkResetToken = async(req, res) => {
    try {
        const { token } = req.params;

        console.log("🔍 Checking reset token:", token);

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Token không hợp lệ hoặc đã hết hạn!",
                valid: false
            });
        }

        res.status(200).json({
            message: "Token hợp lệ!",
            valid: true,
            email: user.email,
            expiresAt: user.resetTokenExpire
        });
    } catch (err) {
        console.error("Check reset token error:", err);
        res.status(500).json({ message: "Lỗi khi kiểm tra token!" });
    }
};