import { WeekType } from '../types/index.ts'

interface LiftSet {
	weight: number
	reps: number
}

function round(n: number) {
	return Math.round(n / 5) * 5
}

export function calc(max: number, week: WeekType, set: 1 | 2 | 3): LiftSet {
	const base = max * 0.9

	return {
		1: {
			1: {
				weight: round(base * 0.65),
				reps: 5,
			},
			2: {
				weight: round(base * 0.75),
				reps: 5,
			},
			3: {
				weight: round(base * 0.85),
				reps: 5,
			},
		},
		2: {
			1: {
				weight: round(base * 0.7),
				reps: 3,
			},
			2: {
				weight: round(base * 0.8),
				reps: 3,
			},
			3: {
				weight: round(base * 0.9),
				reps: 3,
			},
		},
		3: {
			1: {
				weight: round(base * 0.75),
				reps: 5,
			},
			2: {
				weight: round(base * 0.85),
				reps: 3,
			},
			3: {
				weight: round(base * 0.95),
				reps: 1,
			},
		},
		4: {
			1: {
				weight: round(base * 0.4),
				reps: 5,
			},
			2: {
				weight: round(base * 0.5),
				reps: 5,
			},
			3: {
				weight: round(base * 0.6),
				reps: 5,
			},
		},
	}[week][set]
}

export function calcSets(max: number, week: WeekType) {
	return ([1, 2, 3] as const).map((set) => ({
		set,
		lift: calc(max, week, set),
	}))
}
