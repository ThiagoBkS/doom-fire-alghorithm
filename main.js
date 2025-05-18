import DoomFire from "./DoomFire.js";

const doomfire = new DoomFire(document.getElementById("doom-fire"));
doomfire.start();

document.querySelectorAll("[data-hue]").forEach((element) => {
	const hue = element.dataset.hue;
	element.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

	element.addEventListener("click", () => doomfire.changePaletteColor(hue));
});

document.getElementById("change-size").addEventListener("input", (event) => {
	doomfire.changeMatrixSize(parseInt(event.target.value) * 4);
});

document.getElementById("change-fps").addEventListener("input", (event) => {
	doomfire.changeFPS(parseInt(event.target.value));
});

document.getElementById("change-quality").addEventListener("input", (event) => {
	const quality = parseInt(event.target.value * 4);
	doomfire.changeQuality(quality, quality);
});

document
	.getElementById("change-fire-intensity")
	.addEventListener("input", (event) => {
		const invert = event.target.getAttribute("max") - event.target.value;
		doomfire.changeDecayIntensity(parseInt(invert + 2));
	});
