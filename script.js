// Firebase Config
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

// Elements
const googleBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const searchSection = document.getElementById("searchSection");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const voiceBtn = document.getElementById("voiceSearchBtn");

// Google Login
if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    auth.signInWithPopup(provider).then(result => {
      showSearchUI(result.user.email);
    }).catch(console.error);
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    auth.signOut().then(() => location.reload());
  });
}

// Auth state check
auth.onAuthStateChanged(user => {
  if (user) {
    showSearchUI(user.email);
  }
});

function showSearchUI(email) {
  document.getElementById("authButtons").style.display = "none";
  searchSection.style.display = "block";
  document.getElementById("userEmail").textContent = `Welcome, ${email}`;
}

// Search Function (Mock AI + Images + PDF Suggestion)
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;

  resultsDiv.innerHTML = `<h3>Results for "${query}":</h3>`;
  resultsDiv.innerHTML += `
    <p><strong>AI Response:</strong> "${query}" is a very interesting topic. Here's what you might find helpful.</p>
    <p><strong>Image Results:</strong></p>
    <img src="https://source.unsplash.com/400x200/?${query}" alt="${query}" />
    <p><strong>PDF:</strong> <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" target="_blank">Download related PDF</a></p>
  `;
  resultsDiv.style.display = "block";

  const user = auth.currentUser;
  if (user) {
    db.collection("searchHistory").add({
      email: user.email,
      query: query,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
});

// Voice Search
if (voiceBtn) {
  voiceBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      searchInput.value = transcript;
      searchBtn.click();
    };
  });
}
