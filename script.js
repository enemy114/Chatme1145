// When the page loads
window.onload = function () {
    console.log("JS Loaded!");
};

// When the search button is clicked
document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");

    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", function () {
            const userQuery = searchInput.value.trim();
            if (userQuery) {
                alert("You searched for: " + userQuery);
            } else {
                alert("Please type something to search.");
            }
        });
    }
});
