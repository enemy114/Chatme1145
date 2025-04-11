// Firebase config
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
const searchBtn = document.getElementById("searchBtn");
const categories = document.getElementById("categories");

const algoliaClient = algoliasearch("YourAppID", "YourSearchKey");
const index = algoliaClient.initIndex("YourIndexName");

// Auth
googleBtn.onclick = () => {
  auth.signInWithPopup(provider).then(result => {
    showSearchSection(result.user);
  });
};

logoutBtn.onclick = () => {
  auth.signOut().then(() => {
    location.reload();
  });
};

auth.onAuthStateChanged(user => {
  if (user) showSearchSection(user);
});

function showSearchSection(user) {
  document.getElementById("authSection").style.display = "none";
  document.getElementById("searchSection").style.display = "block";
  document.getElementById("welcomeEmail").textContent = `Welcome, ${user.email}`;
}

// Search
searchBtn.onclick = () => {
  const query = searchInput.value.trim();
  if (!query) return;

  index.search(query).then(({ hits }) => {
    resultsDiv.innerHTML = "<h3>Search Results</h3>";
    hits.forEach(hit => {
      const item = document.createElement("div");
      item.innerHTML = `<p><strong>${hit.title}</strong><br>${hit.description || ""}</p>`;
      resultsDiv.appendChild(item);
    });

    categories.style.display = "block";

    const user = auth.currentUser;
    if (user) {
      db.collection("searchHistory").add({
        email: user.email,
        query,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  });
};
