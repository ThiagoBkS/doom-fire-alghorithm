import DoomFire from "./DoomFire.js";

const doomfire = new DoomFire(document.getElementById("doom-fire") as HTMLCanvasElement);
doomfire.start();

document.querySelectorAll("[data-hue]").forEach((element) => {
	if (!(element instanceof HTMLElement)) return;

	const hue = element.dataset.hue;
	element.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

	element.addEventListener("click", () => doomfire.changePaletteColor(hue ? parseInt(hue) : 0));
});

document.getElementById("change-size")!.addEventListener("input", (event) => {
	const element = event.target as HTMLInputElement;

	doomfire.changeMatrixSize(parseInt(element.value) * 4);
});

document.getElementById("change-fps")!.addEventListener("input", (event) => {
	const element = event.target as HTMLInputElement;

	doomfire.changeFPS(parseInt(element.value));
});

document.getElementById("change-quality")!.addEventListener("input", (event) => {
	const element = event.target as HTMLInputElement;
	const quality = parseInt(element.value);

	doomfire.changeQuality(quality, quality);
});

document.getElementById("change-fire-intensity")!.addEventListener("input", (event) => {
	const element = event.target as HTMLInputElement;
	const max = Number(element.getAttribute("max"));
	const value = Number(element.value);
	const invertValue = max - value;

	doomfire.changeDecayIntensity(invertValue + 2);
});
