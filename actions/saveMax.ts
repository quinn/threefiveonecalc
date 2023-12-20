import { LiftType, UserType } from '../types/index.ts'

export async function saveMax(
	data: FormData,
	uid: string,
	currentLift: LiftType,
) {
	const weight = Number(data.get('1rm.weight'))
	const reps = Number(data.get('1rm.reps'))

	const oneRepMaxValue = Math.round(weight / (1.0278 - 0.0278 * reps))
	const oneRepMax = {
		input: { weight, reps },
		value: oneRepMaxValue,
	}

	const kv = await Deno.openKv()
	const result = await kv.get<UserType>(['users', uid])

	const user = result.value ?? {
		uid,
		lifts: [],
	} as UserType

	const liftData = user.lifts.find((lift) => lift.lift === currentLift)

	if (liftData) {
		liftData.oneRepMax = oneRepMax
	} else {
		user.lifts.push({
			lift: currentLift,
			oneRepMax,
		})
	}

	await kv.set(['users', uid], user)
}
