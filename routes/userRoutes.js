import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    getUserProfile,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriend,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", verifyToken, getUserProfile);
router.post("/add-friend", verifyToken, sendFriendRequest);
router.post("/accept-friend", verifyToken, acceptFriendRequest);
router.post("/remove-friend", verifyToken, removeFriend);

export default router;