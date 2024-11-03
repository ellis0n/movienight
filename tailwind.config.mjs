/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'heatmap-gold': 'rgba(255, 215, 0, 0.2)',
				'heatmap-green': 'rgba(0, 255, 0, 0.15)',
				'heatmap-light-green': 'rgba(144, 238, 144, 0.15)',
				'heatmap-yellow': 'rgba(255, 255, 0, 0.15)',
				'heatmap-orange': 'rgba(255, 165, 0, 0.15)',
				'heatmap-red': 'rgba(255, 0, 0, 0.15)',
			},
		},
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
	],
}
