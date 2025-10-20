document.addEventListener("click", (e) => {
    if (e.target.id === "logoutBtn") {
        localStorage.removeItem("token");
        alert("Đăng xuất thành công!");
        window.location.href = "./index.html";
    }
});