document.addEventListener("DOMContentLoaded", async() => {
            const API_URL = "http://localhost:5001/api/friends";
            const token = localStorage.getItem("token");
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

            if (!token) {
                alert("Vui lòng đăng nhập trước!");
                window.location.href = "./index.html";
                return;
            }

            // Lấy ID của người dùng được xem
            const params = new URLSearchParams(window.location.search);
            const profileId = params.get("id") || currentUser.id;

            // Các phần tử DOM
            const usernameEl = document.getElementById("username");
            const emailEl = document.getElementById("email");
            const avatarEl = document.getElementById("avatar");
            const bioEl = document.getElementById("bio");
            const friendBtn = document.getElementById("friendBtn");
            const friendListEl = document.getElementById("friendList");

            try {
                // 🟣 Gọi API lấy thông tin người dùng
                const res = await fetch(`${API_URL}/users/${profileId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message || "Không thể tải thông tin người dùng!");
                    return;
                }

                const user = data.user;
                usernameEl.textContent = user.username;
                emailEl.textContent = user.email;
                avatarEl.src = user.avatar || `https://i.pravatar.cc/150?u=${user._id}`;
                bioEl.textContent = user.bio || "Chưa có tiểu sử.";

                // 🧩 Hiển thị danh sách bạn bè
                if (user.friends && user.friends.length > 0) {
                    friendListEl.innerHTML = "";
                    user.friends.forEach((f) => {
                                const item = document.createElement("div");
                                item.classList.add("friend-item");
                                item.innerHTML = `
                    <img src="${f.avatar || `https://i.pravatar.cc/80?u=${f._id}`}" alt="Avatar">
                    <p>${f.username}</p>
                `;
                friendListEl.appendChild(item);
            });
        } else {
            friendListEl.innerHTML = "<p>Chưa có bạn bè nào.</p>";
        }

        // 🟢 Nếu là chính mình thì ẩn nút kết bạn
        if (currentUser.id === user._id) {
            friendBtn.style.display = "none";
        } else {
            const isFriend = user.friends.some((f) => f._id === currentUser.id);
            friendBtn.textContent = isFriend ? "Hủy kết bạn" : "Kết bạn";
            friendBtn.classList.toggle("btn-outline-danger", isFriend);
        }

    } catch (err) {
        console.error("Error loading profile:", err);
        alert("Lỗi khi tải hồ sơ!");
    }

    // 🟡 Xử lý sự kiện kết bạn / hủy kết bạn
    friendBtn.addEventListener("click", async () => {
        try {
            const action = friendBtn.textContent.includes("Hủy") ? "unfriend" : "add-friend";
            const res = await fetch(`${API_URL}/${action}/${profileId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                // Cập nhật lại giao diện nút
                if (action === "add-friend") {
                    friendBtn.textContent = "Hủy kết bạn";
                    friendBtn.classList.add("btn-outline-danger");
                } else {
                    friendBtn.textContent = "Kết bạn";
                    friendBtn.classList.remove("btn-outline-danger");
                }
            } else {
                alert(data.message || "Thao tác thất bại!");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Lỗi khi xử lý kết bạn!");
        }
    });
});