export const Lifts = [
	'Squat',
	'Bench',
	'Deadlift',
	'Overhead Press',
] as const

export const Weeks = [1, 2, 3, 4] as const

export type LiftType = typeof Lifts[number]
export type WeekType = typeof Weeks[number]

export interface OneRepMax {
	input: {
		weight: number
		reps: number
	}

	value: number
}

export interface LiftData {
	lift: LiftType
	oneRepMax: OneRepMax
}

export interface UserType {
	lifts: LiftData[]
}

// type assertion for LiftType
export function isLiftType(lift: string): lift is LiftType {
	return Lifts.includes(lift as LiftType)
}

export function isWeekType(week: number): week is WeekType {
	return Weeks.includes(week as WeekType)
}
