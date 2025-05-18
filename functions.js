export function generateHSLPalette(hue, steps) {
	const palette = [];

	for (let step = 0; step < steps; step++) {
		const lightness = 5 + (95 * step) / (steps - 1);
		palette.push(`hsl(${hue}, 100%, ${lightness || 100}%)`);
	}

	return palette;
}
