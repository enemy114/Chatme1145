// Firebase & Algolia Initialization
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

// DOM Elements
const googleBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const searchBtn = document.getElementById("searchBtn");
const micBtn = document.getElementById("micBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const searchSection = document.getElementById("searchSection");
const authButtons = document.getElementById("authButtons");
const categories = document.querySelector(".categories");

// Sign In
googleBtn.addEventListener("click", () => {
  auth.signInWithPopup(provider).then(result => {
    showSearchPage(result.user);
  });
});

// Show Search Page
function showSearchPage(user) {
  authButtons.style.display = "none";
  searchSection.style.display = "block";
  document.querySelector(".logo").textContent = `Welcome, ${user.displayName}`;
}

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    location.reload();
  });
});

// Check login state
auth.onAuthStateChanged(user => {
  if (user) {
    showSearchPage(user);
  }
});

// Search functionality
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query !== "") {
    performSearch(query);
  }
});

// Voice Search
if (micBtn) {
  micBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = function (event) {
      const voiceText = event.results[0][0].transcript;
      searchInput.value = voiceText;
      performSearch(voiceText);
    };
  });
}

// Fake AI + Algolia Placeholder
function performSearch(query) {
  resultsDiv.innerHTML = `<h3>Searching for "${query}"...</h3>`;

  // Example AI Response
  setTimeout(() => {
    resultsDiv.innerHTML += `
      <div>
        <p><strong>AI Answer:</strong> Hello! You searched for "${query}". Here's something cool:</p>
        <ul>
          <li>Relevant Image: <a href="https://source.unsplash.com/600x400/?${query}" target="_blank">View</a></li>
          <li>Download PDF: <a href="https://www.africau.edu/images/default/sample.pdf" download>Sample PDF</a></li>
        </ul>
      </div>`;
    categories.style.display = "flex";
  }, 1200);

  // Save to Firestore
  const user = auth.currentUser;
  if (user) {
    db.collection("searchHistory").add({
      email: user.email,
      query: query,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}
