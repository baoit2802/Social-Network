async function includeComponent(selector, filePath) {
    const element = document.querySelector(selector);
    if (element) {
        try {
            const res = await fetch(filePath);
            if (res.ok) {
                const html = await res.text();
                element.innerHTML = html;
            } else {
                console.error(`Không thể tải ${filePath}: ${res.status}`);
            }
        } catch (err) {
            console.error(`Lỗi khi tải ${filePath}:`, err);
        }
    }
}

// Khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    includeComponent("#navbar", "./components/navbar.html");
    includeComponent("#footer", "./components/footer.html");
});