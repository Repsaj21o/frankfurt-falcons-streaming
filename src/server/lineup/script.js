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

// Überwacht die Steuerung (Einblenden/Ausblenden)
db.ref('lineup_control').on('value', (snap) => {
    const ctrl = snap.val();
    if (ctrl && ctrl.visible) {
        // Wenn sichtbar, lade die Daten für das spezifische Team und die Reihe
        updateDisplay(ctrl.team || "2bundesliga", ctrl.activeLine || 1);
        document.getElementById('lineup-screen').classList.add('active');
    } else {
        document.getElementById('lineup-screen').classList.remove('active');
    }
});

function updateDisplay(team, lineNr) {
    // Titel setzen
    document.getElementById('line-title').innerText = 'REIHE ' + lineNr;
    
    // Daten aus dem Team-Pfad laden
    db.ref('teams/' + team + '/lineups/' + lineNr).once('value', (lineSnap) => {
        const data = lineSnap.val() || {};
        const positions = ['LW', 'RW', 'C', 'LD', 'RD', 'G'];
        
        positions.forEach(pos => {
            const el = document.getElementById('p-' + pos);
            if (el) {
                el.innerText = data[pos] || '-';
            }
        });
    });
}