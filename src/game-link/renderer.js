let pattern = /(https:\/\/)?saisonmanager.de\/([a-z]{3,7})\/(\d+)-([-0-9a-z]+)\/spiel\/(\d{5})\/?/, init_res;
init();

async function tryGame(value) {
    let res = pattern.exec(value);
    document.getElementById("preview").innerHTML = "";
    document.getElementById("confirm").innerHTML = "";
    if (res !== null) {
        let data = await fetch(`https://saisonmanager.de/api/v2/games/${res[5]}.json`).then((res) => res.json());
        if (res[2] == init_res.game_operations[`${data.game_operation_id-1}`].path && res[3] == data.league_id && res[4] == data.league_name.replace(/[^0-9a-zA-Z]+/g, "-").toLowerCase()) {
            loadPreview(data);
            setConfirmButton(res[5]);
        }
    } else {
        res = /^\d{5}$/.exec(value);
        fetch(`https://saisonmanager.de/api/v2/games/${res[0]}.json`)
            .then((data) => {
                if (data.status === 200) {
                    data.json().then((data) => {
                        loadPreview(data);
                        setConfirmButton(res[0]);
                    });
                }
            }
        );
    }
}

async function loadPreview(data) {
    document.getElementById("preview").innerHTML = `
        <div class="saisonmanager">
            <div class="container mx-auto px-4 lg:px-8">
                <div class="grid grid-cols-1 xl:grid-cols-5 mt-4 lg:mt-8 gap-8">
                    <div class="xl:col-span-3"><fb-match-pairing-list>
                        <fb-match-pairing class="block even:bg-fb-gray-300">
                            <div class="grid grid-cols-[42px,1fr,100px] md:grid-cols-[1fr,42px,80px,42px,1fr] grid-rows-[40px,40px] md:grid-rows-1 md:gap-x-5 items-center md:h-20 cursor-pointer hover:bg-fb-gray-200 transition my-4 md:my-0">
                                <div class="md:text-right text-sm font-bold order-2 md:order-1 truncate"> ${data.home_team_name} </div>
                                <div class="order-1 md:order-2 pr-3 md:pr-0">
                                    <img class="h-8 md:h-full w-full object-contain" src="https://saisonmanager.de${data.home_team_logo}">
                                    <!---->
                                </div>
                                <div class="relative order-3 row-span-2 md:order-3 text-center font-bold tracking-widest md:grid md:grid-cols-1">
                                    <p class="text-xs text-fb-gray-400 font-normal whitespace-nowrap"> ${data.date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$3.$2.$1")} </p>
                                    <!---->
                                    <!---->
                                    <!---->
                                    <p class="text-sm text-fb-gray-400 font-normal whitespace-nowrap"> ${data.start_time} </p>
                                    <!---->
                                    <!---->
                                    <!---->
                                    <!---->
                                    <!---->
                                    <!---->
                                    <!---->
                                </div>
                                <div class="order-3 md:order-4 pr-3 md:pr-0">
                                    <img class="h-8 md:h-full w-full object-contain" src="https://saisonmanager.de${data.guest_team_logo}">
                                    <!---->
                                </div>
                                <div class="text-sm font-bold order-3 md:order-5 truncate"> ${data.guest_team_name} </div>
                            </div>
                            <!---->
                        </fb-match-pairing>
                        <!---->
                    </fb-match-pairing-list>
                    <!---->
                </div>
            </div>
        </div>`;
}

async function setConfirmButton(gameId) {
    document.getElementById("confirm").innerHTML = `<button id="confirmButton" type="button" onclick="window.main.confirmGameId(${gameId})">Confirm</button>`;
}

async function init() {
    init_res = await fetch("https://saisonmanager.de/api/v2/init.json").then((res) => res.json());
    tryGame(document.getElementById("game").value)
}