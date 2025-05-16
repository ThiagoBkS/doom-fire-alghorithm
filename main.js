import DoomFire from "./DoomFire.js";

const doomfire = new DoomFire(document.getElementById("doom-fire"));

doomfire.start();


// TEMPORARY CODE
document.getElementById("change-fps").addEventListener("input", (event) => {
    doomfire.config.fps = event.target.value;
});


document.getElementById("change-palette-color").addEventListener("input", (event) => {
    doomfire.changePaletteColor(event.target.value);
});

document.getElementById("change-fire-intensity").addEventListener("input", (event) => {
    const invert = event.target.getAttribute("max") - event.target.value;
    doomfire.changeDecayIntensity(parseInt(invert + 2));
});

document.getElementById("toggle-hover-effect").addEventListener("input", (event) => {
    doomfire.config.isFadeFireActive = event.target.checked
});
