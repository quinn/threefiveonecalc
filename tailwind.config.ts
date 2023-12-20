import { type Config } from 'tailwindcss'

export default {
	content: [
		'{routes,islands,components}/**/*.{ts,tsx}',
	],
	safelist: [
		'bg-orange-100',
		'bg-orange-200',
		'bg-orange-300',
	],
} satisfies Config
