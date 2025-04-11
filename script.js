// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh8oGpHFh9O31cOXEfxkJVDX4RC5sDHrw",
  authDomain: "chatmeauth.firebaseapp.com",
  projectId: "chatmeauth",
  storageBucket: "chatmeauth.appspot.com",
  messagingSenderId: "964614544359",
  appId: "1:964614544359:web:b714e790307691694d3b42"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

const googleBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const loginContainer = document.getElementById("loginContainer");
const searchContainer = document.getElementById("searchContainer");

// Algolia config (replace with your real keys)
const algoliaAppId = "YOUR_ALGOLIA_APP_ID";
const algoliaSearchKey = "YOUR_ALGOLIA_SEARCH_KEY";
const algoliaIndexName = "YOUR_INDEX_NAME";

const algoliaClient = algoliasearch(algoliaAppId, algoliaSearchKey);
const index = algoliaClient.initIndex(algoliaIndexName);

// Google login
if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      loginContainer.style.display = "none";
      searchContainer.style.display = "block";
      document.getElementById("userEmail").textContent = user.email;
    }).catch(error => {
      console.error("Login error:", error);
    });
  });
}

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    loginContainer.style.display = "block";
    searchContainer.style.display = "none";
  });
});

// Perform search
function performSearch(query) {
  index.search(query).then(({ hits }) => {
    resultsDiv.innerHTML = "<h3>Search Results:</h3>";
    hits.forEach(hit => {
      const item = document.createElement("div");
      item.innerHTML = `<p><strong>${hit.title}</strong><br>${hit.description || ''}</p>`;
      resultsDiv.appendChild(item);
    });
    resultsDiv.style.display = 'block';

    const user = auth.currentUser;
    if (user) {
      db.collection("searchHistory").add({
        email: user.email,
        query: query,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  });
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) performSearch(query);
});

// Auto login display
auth.onAuthStateChanged(user => {
  if (user) {
    loginContainer.style.display = "none";
    searchContainer.style.display = "block";
    document.getElementById("userEmail").textContent = user.email;
  } else {
    loginContainer.style.display = "block";
    searchContainer.style.display = "none";
  }
});
