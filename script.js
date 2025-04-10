document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const searchBtn = document.getElementById("searchBtn");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const searchBox = document.getElementById("searchBox");
    const adminNotice = document.getElementById("adminNotice");

    // Switch forms
    window.toggleForms = function () {
        if (loginForm.style.display === "none") {
            loginForm.style.display = "block";
            signupForm.style.display = "none";
        } else {
            loginForm.style.display = "none";
            signupForm.style.display = "block";
        }
    };

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            const user = document.getElementById("loginUsername").value;
            const pass = document.getElementById("loginPassword").value;

            loginForm.style.display = "none";
            searchBox.style.display = "block";

            if (user === "admin" && pass === "1234") {
                adminNotice.textContent = "Logged in as Admin.";
            } else {
                adminNotice.textContent = "";
            }
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener("click", function () {
            const pass = document.getElementById("createPassword").value;
            const confirm = document.getElementById("confirmPassword").value;

            if (pass !== confirm) {
                alert("Passwords do not match.");
            } else {
                alert("Account created successfully!");
                toggleForms();
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
