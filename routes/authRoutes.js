import express from "express";
import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getUserInfo,
    checkResetToken
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Đăng ký
router.post("/register", registerUser);

// Đăng nhập
router.post("/login", loginUser);

// Quên mật khẩu
router.post("/forgot-password", forgotPassword);

//Đặt lại mật khẩu
router.post("/reset-password/:token", resetPassword);

//Kiểm tra token reset password
router.get("/check-reset-token/:token", checkResetToken);

//Lấy thông tin người dùng
router.get("/me", verifyToken, getUserInfo);

export default router;