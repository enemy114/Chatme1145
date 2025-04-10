document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");
    const searchBtn = document.getElementById("searchBtn");

    const loginForm = document.getElementById("loginForm");
    const searchBox = document.getElementById("searchBox");
    const adminNotice = document.getElementById("adminNotice");

    const ADMIN_USER = "admin";
    const ADMIN_PASS = "1234"; // You can change this

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            const user = document.getElementById("username").value;
            const pass = document.getElementById("password").value;

            if (user === ADMIN_USER && pass === ADMIN_PASS) {
                loginForm.style.display = "none";
                searchBox.style.display = "block";
                adminNotice.textContent = "Logged in as Admin.";
            } else {
                loginForm.style.display = "none";
                searchBox.style.display = "block";
                adminNotice.textContent = "";
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", function () {
            const userQuery = document.getElementById("searchInput").value.trim();
            if (userQuery) {
                const searchURL = "https://duckduckgo.com/?q=" + encodeURIComponent(userQuery);
                window.open(searchURL, "_blank");
            } else {
                alert("Please type something to search.");
            }
        });
    }
});
