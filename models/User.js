import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        // 👤 Tên hiển thị
        username: {
            type: String,
            required: [true, "Tên người dùng là bắt buộc"],
            unique: true,
            trim: true,
        },

        // 📧 Email đăng nhập
        email: {
            type: String,
            required: [true, "Email là bắt buộc"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
        },

        // 🔒 Mật khẩu (đã hash)
        password: {
            type: String,
            required: [true, "Mật khẩu là bắt buộc"],
            minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
        },

        // 🖼 Ảnh đại diện
        avatar: {
            type: String,
            default: "https://i.pravatar.cc/150?u=default", // ảnh ngẫu nhiên mặc định
        },

        // 📝 Mô tả ngắn / tiểu sử
        bio: {
            type: String,
            default: "",
            maxlength: 200,
        },

        // 🔁 Dùng cho chức năng reset mật khẩu
        resetToken: String,
        resetTokenExpire: Date,
    }, { timestamps: true } // Tự động thêm createdAt, updatedAt
);

// 🧩 Index để tìm kiếm nhanh theo email và username
userSchema.index({ email: 1, username: 1 });

// 🧱 Tạo model
const User = mongoose.model("User", userSchema);

export default User;
