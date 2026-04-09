let pattern = /(https:\/\/)?saisonmanager.de\/([a-z]{3,7})\/(\d+)-([-0-9a-z]+)\/spiel\/(\d{5})\/?/, init_res;
init();

async function tryGame(value) {
    let res = pattern.exec(value);
    if (res !== null) {
        let data = await fetch(`https://saisonmanager.de/api/v2/games/${res[5]}.json`).then((res) => res.json());
        if (res[2] == init_res.game_operations[`${data.game_operation_id-1}`].path && res[3] == data.league_id && res[4] == data.league_name.replace(/[^0-9a-zA-Z]+/g, "-").toLowerCase()) {
            loadPreview(data);
            setConfirmButton(res[5]);
        }
    }
}

async function loadPreview(data) {
    document.getElementById("preview").innerHTML = `
        <div class="relative w-full grid grid-cols-[42px,1fr,80px] gap-2 items-center px-2.5 mt-4 cursor-pointer transition md:grid-cols-[1fr,42px,80px,42px,1fr,1fr] md:grid-rows-[36px,80px] md:gap-y-2 md:gap-5 md:mt-0 md:px-0 md:pb-2 xl:grid-cols-[1fr,1fr,42px,80px,42px,1fr,1fr] xl:grid-rows-1 xl:h-20 xl:pt-2 xl:px-5 hover:bg-fb-gray-200 grid-rows-[30px,40px,40px]"> 
            <div class="col-span-3 md:bg-fb-gray-700 text-fb-gray-400 text-sm md:flex md:col-span-6 md:h-full md:items-center md:px-2 xl:col-span-1 xl:bg-transparent order-1">
                <!---->       
                <div class="flex flex-row xl:flex-col gap-[10px]">
                        <p class="xl:flex-1"> 
                            ${data.date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$3.$2.$1")} 
                            <!---->
                            <!---->
                            - ${data.start_time} Uhr
                            <!---->
                            <!----> 
                        </p>
                        <span class="hidden md:inline lg:hidden">-</span>
                        <p class="hidden md:block"> ${data.arena_short} </p>
                        <!---->
                    </div>
                </div>
            <div class="md:text-right text-sm order-3 md:order-2 font-bold">${data.home_team_name}</div>
            <div class="order-1 md:order-2">
                <img class="h-8 md:h-full w-full object-contain" src="https://saisonmanager.de${data.home_team_logo}">
                <!---->
            </div>
            <div class="text-center font-bold tracking-widest order-4 row-span-2 md:row-span-1">
                <!---->
                <p class="text-base whitespace-nowrap"> ${data.start_time} Uhr </p>
                <!---->
                <!---->
                <!---->
                <!---->
                <!---->
                <!---->
            </div>
            <div class="order-5">
                <img class="h-8 md:h-full w-full object-contain" src="https://saisonmanager.de${data.guest_team_logo}">
                <!---->
            </div>
            <div class="text-sm order-6 font-bold">${data.guest_team_name}</div>
            <div class="text-center md:text-right text-fb-gray-400 text-sm col-span-3 md:col-span-1 order-7 pb-2 md:pb-0 flex flex-row md:flex-col md:pr-4 xl:pr-0">
                <!---->
                <!---->
                <div> Schiedsrichter: ${data.nominated_referees} </div>
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