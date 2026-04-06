let pattern = /https:\/\/saisonmanager.de\/([a-z]{3,7})\/(\d+)-([-0-9a-z]+)\/spiel\/(\d{5})\/?/, init_res;
init();

async function tryGame(value) {
    let res = pattern.exec(value);
    if (res !== null) {
        let data = await fetch(`https://saisonmanager.de/api/v2/games/${res[4]}.json`).then((res) => res.json());
        if (res[1] == init_res.game_operations[`${data.game_operation_id-1}`].path && res[2] == data.league_id && res[3] == data.league_name.replace(/[^0-9a-zA-Z]+/g, "-").toLowerCase()) {
            loadPreview(res[4]);
        }
    }
}

async function loadPreview(gameId) {
    document.getElementById("preview").innerHTML = `<p>${gameId}</p>`;
}

async function init() {
    init_res = await fetch("https://saisonmanager.de/api/v2/init.json").then((res) => res.json());
    tryGame(document.getElementById("game").value)
}