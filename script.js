document.addEventListener("DOMContentLoaded", function () {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");

    if (searchBtn && searchInput) {
        searchBtn.addEventListener("click", function () {
            const userQuery = searchInput.value.trim();
            if (userQuery) {
                // This will open search results in a new tab using DuckDuckGo
                const searchURL = "https://duckduckgo.com/?q=" + encodeURIComponent(userQuery);
                window.open(searchURL, "_blank");
            } else {
                alert("Please type something to search.");
            }
        });
    }
});
