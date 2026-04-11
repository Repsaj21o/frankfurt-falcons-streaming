const firebaseConfig = {
    apiKey: "AIzaSyCfChQFOjIgBIcXPd57MTalvRrHFXr4UzM",
    authDomain: "obs-overlay-2950c.firebaseapp.com",
    databaseURL: "https://obs-overlay-2950c-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "obs-overlay-2950c",
    storageBucket: "obs-overlay-2950c.firebasestorage.app",
    messagingSenderId: "1094353952185",
    appId: "1:1094353952185:web:da70794c9e5104fda22a68"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

db.ref('scoreboard_active').on('value', (snap) => {
    const data = snap.val() || {};
    if(data.img) document.getElementById('scoreboard-img').src = data.img;
    document.getElementById('scoreA').innerText = data.scoreA || 0;
    document.getElementById('scoreB').innerText = data.scoreB || 0;
});