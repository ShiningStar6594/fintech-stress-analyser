function makeRepeatable(buttonId, actionFunction) {
    const btn = document.getElementById(buttonId);
    let timer = null;

    const stop = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

    const start = () => {
        if (timer) return; //if started return
        if (actionFunction() === false) return; //if reach limit, return
        timer = setInterval(() => {
            const result = actionFunction();
            if (result === false) {
                stop(); 
            }//if reached limit then stop
        }, 150);
    };

    btn.addEventListener("mousedown", start);//hold the button then start
    btn.addEventListener("mouseup", stop);//unhold the button then stop
    btn.addEventListener("mouseleave", stop); //leave the area then stop
}

makeRepeatable("addSectorBtn", addSector);
makeRepeatable("deleteSectorBtn", deleteSector);
makeRepeatable("addShockBtn", add_shock_sec);
makeRepeatable("deleteShockBtn", del_shock_sec);