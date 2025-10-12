document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:5001/api/auth";

    // === Form ===
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const forgotForm = document.getElementById("forgotForm");
    const formTitle = document.getElementById("form-title");

    // === Buttons toggle ===
    const showRegisterBtn = document.getElementById("showRegister");
    const showLoginBtn = document.getElementById("showLogin");
    const showForgotBtn = document.getElementById("showForgot");

    // === Hàm chuyển đổi form ===
    function showLoginForm() {
        loginForm.classList.remove("d-none");
        registerForm.classList.add("d-none");
        forgotForm.classList.add("d-none");
        formTitle.textContent = "Đăng nhập";
        showLoginBtn.style.display = "none";
        showRegisterBtn.style.display = "inline";
        showForgotBtn.style.display = "inline";
    }

    function showRegisterForm() {
        registerForm.classList.remove("d-none");
        loginForm.classList.add("d-none");
        forgotForm.classList.add("d-none");
        formTitle.textContent = "Đăng ký";
        showRegisterBtn.style.display = "none";
        showLoginBtn.style.display = "inline";
        showForgotBtn.style.display = "none";
    }

    function showForgotForm() {
        forgotForm.classList.remove("d-none");
        loginForm.classList.add("d-none");
        registerForm.classList.add("d-none");
        formTitle.textContent = "Quên mật khẩu";
        showRegisterBtn.style.display = "inline";
        showLoginBtn.style.display = "inline";
        showForgotBtn.style.display = "none";
    }

    // === Event click toggle ===
    showRegisterBtn.addEventListener("click", showRegisterForm);
    showLoginBtn.addEventListener("click", showLoginForm);
    showForgotBtn.addEventListener("click", showForgotForm);

    // === Đăng ký ===
    registerForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        const username = document.getElementById("regUsername").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value.trim();

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();
            alert(data.message || "Đăng ký thành công!");
            if (res.ok) showLoginForm();
        } catch (err) {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    });

    // === Đăng nhập ===
    loginForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "./home.html"; // chuyển hướng sang home
            } else {
                alert(data.message || "Sai thông tin đăng nhập!");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi server khi đăng nhập!");
        }
    });

    // === Quên mật khẩu ===
    forgotForm.addEventListener("submit", async(e) => {
        e.preventDefault();
        const email = document.getElementById("forgotEmail").value.trim();

        try {
            const res = await fetch(`${API_URL}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (res.ok) {
                alert(`Liên kết đặt lại mật khẩu đã được gửi tới ${email}`);
                showLoginForm();
            } else {
                alert(data.message || "Không thể gửi email!");
            }
        } catch (err) {
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    });
});