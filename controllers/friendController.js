import User from "../models/User.js";

// 🟢 Gửi lời mời kết bạn
export const addFriend = async(req, res) => {
    try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.id;

        if (currentUserId === targetUserId)
            return res.status(400).json({ message: "Không thể kết bạn với chính mình!" });

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) return res.status(404).json({ message: "Người dùng không tồn tại!" });

        if (targetUser.friends.includes(currentUserId))
            return res.status(400).json({ message: "Hai bạn đã là bạn bè!" });

        if (targetUser.friendRequests.includes(currentUserId))
            return res.status(400).json({ message: "Bạn đã gửi lời mời kết bạn!" });

        targetUser.friendRequests.push(currentUserId);
        await targetUser.save();

        res.status(200).json({ message: "Đã gửi lời mời kết bạn!" });
    } catch (err) {
        console.error("Add friend error:", err);
        res.status(500).json({ message: "Lỗi server khi gửi lời mời!" });
    }
};

// 🟡 Hủy kết bạn
export const unfriend = async(req, res) => {
    try {
        const currentUserId = req.user.id;
        const targetUserId = req.params.id;

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) return res.status(404).json({ message: "Người dùng không tồn tại!" });

        currentUser.friends = currentUser.friends.filter(
            (id) => id.toString() !== targetUserId
        );
        targetUser.friends = targetUser.friends.filter(
            (id) => id.toString() !== currentUserId
        );

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: "Đã hủy kết bạn thành công!" });
    } catch (err) {
        console.error("Unfriend error:", err);
        res.status(500).json({ message: "Lỗi server khi hủy kết bạn!" });
    }
};

// 🟣 Xem thông tin hồ sơ người dùng
export const getUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password -resetToken -resetTokenExpire")
            .populate("friends", "username avatar");

        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

        res.status(200).json({ user });
    } catch (err) {
        console.error("Get profile error:", err);
        res.status(500).json({ message: "Lỗi server khi tải hồ sơ!" });
    }
};