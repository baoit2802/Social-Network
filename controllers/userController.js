import User from "../models/User.js";

export const getUserProfile = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server khi lấy thông tin người dùng!" });
    }
};

export const sendFriendRequest = async(req, res) => {
    try {
        const { targetId } = req.body;
        const user = await User.findById(req.user.id);
        const target = await User.findById(targetId);

        if (!target) return res.status(404).json({ message: "Người dùng không tồn tại!" });
        if (user.friendRequests.includes(targetId))
            return res.status(400).json({ message: "Đã gửi lời mời rồi!" });
        if (user.friends.includes(targetId))
            return res.status(400).json({ message: "Đã là bạn bè!" });

        target.friendRequests.push(user._id);
        await target.save();

        res.status(200).json({ message: "Đã gửi lời mời kết bạn!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi gửi lời mời kết bạn!" });
    }
};

export const acceptFriendRequest = async(req, res) => {
    try {
        const { senderId } = req.body;
        const user = await User.findById(req.user.id);
        const sender = await User.findById(senderId);

        if (!sender) return res.status(404).json({ message: "Người gửi không tồn tại!" });

        user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== senderId
        );

        user.friends.push(sender._id);
        sender.friends.push(user._id);

        await user.save();
        await sender.save();

        res.status(200).json({ message: "Kết bạn thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi chấp nhận kết bạn!" });
    }
};

export const removeFriend = async(req, res) => {
    try {
        const { friendId } = req.body;
        const user = await User.findById(req.user.id);
        const friend = await User.findById(friendId);

        if (!friend) return res.status(404).json({ message: "Không tìm thấy bạn!" });

        user.friends = user.friends.filter((id) => id.toString() !== friendId);
        friend.friends = friend.friends.filter((id) => id.toString() !== req.user.id);

        await user.save();
        await friend.save();

        res.status(200).json({ message: "Đã hủy kết bạn!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi hủy kết bạn!" });
    }
};