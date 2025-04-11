// Firebase Setup
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
const authSection = document.getElementById("authSection");
const searchSection = document.getElementById("searchSection");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

// Auth
googleBtn.addEventListener("click", () => {
  auth.signInWithPopup(provider).then((result) => {
    authSection.style.display = "none";
    searchSection.style.display = "block";
  }).catch((error) => {
    alert("Login error: " + error.message);
  });
});

// Search
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;
  resultsDiv.innerHTML = `<h3>Search Results for "${query}"</h3>`;
  document.getElementById("categories").style.display = "block";

  // Log search
  const user = auth.currentUser;
  if (user) {
    db.collection("searches").add({
      email: user.email,
      query: query,
      time: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  // Placeholder: Replace with Algolia or AI later
  resultsDiv.innerHTML += `<p>Sorry, AI search not integrated yet. This is a placeholder.</p>`;
});

// Voice Search
document.getElementById("voiceSearchBtn").addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.onresult = (event) => {
    searchInput.value = event.results[0][0].transcript;
  };
  recognition.start();
});

function showTab(type) {
  resultsDiv.innerHTML = `<h3>${type.toUpperCase()} results will show here</h3>`;
}
