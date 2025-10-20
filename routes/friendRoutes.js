import express from "express";
import { addFriend, unfriend, getUserProfile } from "../controllers/friendController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Kết bạn
router.post("/add-friend/:id", verifyToken, addFriend);

// Hủy kết bạn
router.post("/unfriend/:id", verifyToken, unfriend);

// Xem hồ sơ người dùng
router.get("/users/:id", verifyToken, getUserProfile);

export default router;