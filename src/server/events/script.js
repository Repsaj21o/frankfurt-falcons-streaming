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
const container = document.getElementById('event-container');

let initialLoad = true;

db.ref('lastEvent').on('value', (snapshot) => {
    if (initialLoad) {
        initialLoad = false;
        return;
    }
    const data = snapshot.val();
    if (data) {
        const labelEl = document.getElementById('label');
        
        if (data.type === 'goal') {
            labelEl.innerText = "Tor erzielt";
            labelEl.style.color = "#ff4444"; // Tor bleibt Rot
            document.getElementById('player').innerText = data.player;
            document.getElementById('detail').innerText = data.assist ? `Assist: ${data.assist}` : "";
        } else {
            labelEl.innerText = "Zeitstrafe";
            labelEl.style.color = "#ffffff"; // Strafe ist jetzt Weiß
            document.getElementById('player').innerText = data.player;
            document.getElementById('detail').innerText = `Dauer: ${data.duration}`;
        }

        container.classList.add('active');
        setTimeout(() => { container.classList.remove('active'); }, 5000);
    }
});

const queue = [];

const socket = new WebSocket("ws://127.0.0.1:3000/events");
const channel = new BroadcastChannel("Main");

socket.onopen = () => socket.send("WS /events");
socket.onclose = (ev) => window.history.back();
socket.onmessage = (ev) => queue.push(ev.data);

channel.onmessage = (ev) => {
    channel.onmessage = null;
    channel.postMessage("Main /events");
};