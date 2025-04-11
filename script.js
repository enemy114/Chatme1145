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

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signUpBtn = document.getElementById("signUpBtn");
const loginBtn = document.getElementById("loginBtn");
const googleBtn = document.getElementById("googleBtn");
const logoutBtn = document.getElementById("logoutBtn");

const authSection = document.getElementById("authSection");
const searchSection = document.getElementById("searchSection");
const userEmailSpan = document.getElementById("userEmail");

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");
const categoriesDiv = document.getElementById("categories");

signUpBtn.onclick = () => {
  auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
    .then(() => alert("Account created"))
    .catch(e => alert(e.message));
};

loginBtn.onclick = () => {
  auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
    .catch(e => alert(e.message));
};

googleBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(e => alert(e.message));
};

logoutBtn.onclick = () => {
  auth.signOut();
};

auth.onAuthStateChanged(user => {
  if (user) {
    authSection.style.display = "none";
    searchSection.style.display = "block";
    userEmailSpan.textContent = user.email;
  } else {
    authSection.style.display = "block";
    searchSection.style.display = "none";
  }
});

searchBtn.onclick = () => {
  const query = searchInput.value.trim();
  if (query) {
    resultsDiv.innerHTML = `<p>Results for "<strong>${query}</strong>":</p>`;
    categoriesDiv.style.display = "block";

    // Example result
    resultsDiv.innerHTML += `<div><p><strong>${query}</strong> is being processed with AI...</p></div>`;

    // Store to Firestore
    const user = auth.currentUser;
    if (user) {
      db.collection("searches").add({
        email: user.email,
        query: query,
        time: new Date()
      });
    }
  }
};
