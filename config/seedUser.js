import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const createDefaultUser = async() => {
    try {
        // Kiểm tra xem đã có tài khoản nào chưa
        const existingUser = await User.findOne({ email: "admin@example.com" });
        if (existingUser) {
            console.log("🟢 Tài khoản mặc định đã tồn tại.");
            return;
        }

        // Nếu chưa, tạo tài khoản mặc định
        const hashedPassword = await bcrypt.hash("123456", 10);
        const defaultUser = new User({
            username: "admin",
            email: "admin@example.com",
            password: hashedPassword,
            bio: "Tài khoản mặc định của hệ thống",
        });

        await defaultUser.save();
        console.log("✅ Tạo tài khoản mặc định thành công:");
        console.log("   📧 Email: admin@example.com");
        console.log("   🔑 Mật khẩu: 123456");
    } catch (err) {
        console.error("❌ Lỗi khi tạo tài khoản mặc định:", err.message);
    }
};