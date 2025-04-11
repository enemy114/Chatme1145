// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAh8oGpHFh9O31cOXEfxkJVDX4RC5sDHrw",
  authDomain: "chatmeauth.firebaseapp.com",
  projectId: "chatmeauth",
  storageBucket: "chatmeauth.appspot.com",
  messagingSenderId: "964614544359",
  appId: "1:964614544359:web:b714e790307691694d3b42"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

// UI elements
const loginSection = document.getElementById("loginSection");
const appSection = document.getElementById("appSection");
const userEmail = document.getElementById("userEmail");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const categoriesDiv = document.querySelector(".categories");
const voiceIcon = document.getElementById("voiceIcon");

// Auth flow
loginBtn.addEventListener("click", () => {
  auth.signInWithPopup(provider).then(result => {
    const user = result.user;
    userEmail.textContent = "Welcome, " + user.email;
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
  });
});

logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    loginSection.classList.remove("hidden");
    appSection.classList.add("hidden");
    resultsDiv.innerHTML = "";
    searchInput.value = "";
  });
});

// Maintain session
auth.onAuthStateChanged(user => {
  if (user) {
    userEmail.textContent = "Welcome, " + user.email;
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
  }
});

// AI + Search
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = "<p>Loading AI response...</p>";
  categoriesDiv.style.display = "flex";

  fetch(`https://api.duckduckgo.com/?q=${query}&format=json`)
    .then(res => res.json())
    .then(data => {
      let aiAnswer = data.AbstractText || "No detailed answer found, but here’s what we got.";
      resultsDiv.innerHTML = `<h3>AI Answer:</h3><p>${aiAnswer}</p>`;
      if (auth.currentUser) {
        db.collection("searchHistory").add({
          email: auth.currentUser.email,
          query: query,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    });
});

// Voice search
voiceIcon.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = (event) => {
    searchInput.value = event.results[0][0].transcript;
    searchBtn.click();
  };
});

// Categories
const categoryBtns = document.querySelectorAll(".categories button");
categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    const type = btn.textContent.toLowerCase();
    if (!query) return;

    let url = "";
    if (type === "images") {
      url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;
    } else if (type === "pdfs") {
      url = `https://www.google.com/search?q=${encodeURIComponent(query)}+filetype:pdf`;
    } else if (type === "news") {
      url = `https://news.google.com/search?q=${encodeURIComponent(query)}`;
    } else if (type === "shopping") {
      url = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;
    }
    window.open(url, "_blank");
  });
});
