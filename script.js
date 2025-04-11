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

// Algolia config
const algoliaClient = algoliasearch("Your_APP_ID", "Your_SEARCH_ONLY_API_KEY");
const index = algoliaClient.initIndex("Your_INDEX_NAME");

// Elements
const loginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const searchBtn = document.getElementById("searchBtn");
const voiceBtn = document.getElementById("voiceBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const authButtons = document.getElementById("authButtons");
const searchSection = document.getElementById("searchSection");

// Sign in
loginBtn.onclick = () => {
  auth.signInWithPopup(provider).then(res => {
    const user = res.user;
    authButtons.style.display = "none";
    searchSection.style.display = "block";
  });
};

// Logout
logoutBtn.onclick = () => {
  auth.signOut().then(() => {
    authButtons.style.display = "block";
    searchSection.style.display = "none";
  });
};

// Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    authButtons.style.display = "none";
    searchSection.style.display = "block";
  } else {
    authButtons.style.display = "block";
    searchSection.style.display = "none";
  }
});

// Search
searchBtn.onclick = () => {
  const query = searchInput.value.trim();
  if (!query) return;
  performSearch(query);
};

// AI Respond
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query.toLowerCase().startsWith("ai:")) {
      showAIResponse(query.slice(3));
    } else {
      performSearch(query);
    }
  }
});

// Voice search
if ('webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';

  voiceBtn.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onresult = (e) => {
    const voiceText = e.results[0][0].transcript;
    searchInput.value = voiceText;
    performSearch(voiceText);
  };
}

// Search function
function performSearch(query) {
  index.search(query).then(({ hits }) => {
    resultsDiv.innerHTML = `<h2>Results for "${query}":</h2>`;
    hits.forEach(hit => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${hit.title}</strong><br>${hit.description || ""}<hr>`;
      resultsDiv.appendChild(div);
    });

    // Store search
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

// AI response function
function showAIResponse(input) {
  resultsDiv.innerHTML = `<h2>AI Response</h2>`;
  const response = document.createElement("div");
  response.innerHTML = `<p>I found this based on your request "<strong>${input}</strong>":</p>
    <ul>
      <li><a href="https://example.com/file.pdf" download>Download PDF</a></li>
      <li><img src="https://source.unsplash.com/600x400/?${input}" alt="image result" style="max-width:100%; border-radius:10px;"/></li>
    </ul>`;
  resultsDiv.appendChild(response);
}
