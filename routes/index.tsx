/// <reference lib="deno.unstable" />
import { useSignal } from '@preact/signals'
import { Handlers, PageProps } from '$fresh/server.ts'
import { getCookies, setCookie } from '$std/http/cookie.ts'
import { ulid } from 'https://deno.land/x/ulid@v0.3.0/mod.ts'
import {
	isLiftType,
	isWeekType,
	LiftData,
	Lifts,
	LiftType,
	UserType,
	Weeks,
	WeekType,
} from '../types/index.ts'
import { OneRepMaxCalculator } from '../islands/OneRepMaxCalculator.tsx'
import { invariant } from '../util/invariant.ts'
import { LiftSelect } from '../islands/LiftSelect.tsx'
import { WeekSelect } from '../islands/WeekSelect.tsx'
import { calc, calcSets } from '../util/calc.ts'
import { saveMax } from '../actions/saveMax.ts'

const CookieName = 'session'

interface Data {
	user?: UserType
	currentLift: LiftType
	currentWeek: WeekType
	liftData?: LiftData
}

export const handler: Handlers<Data> = {
	async GET(req, ctx) {
		const url = new URL(req.url)
		const cookies = getCookies(req.headers)
		let uid = cookies[CookieName]

		const headers = new Headers()

		if (!uid) {
			uid = ulid()

			setCookie(headers, {
				name: CookieName,
				value: uid,
				maxAge: 60 * 60 * 24 * 365 * 10,
				sameSite: 'Lax', // this is important to prevent CSRF attacks
				domain: url.hostname,
				path: '/',
				secure: true,
			})
		}

		const currentLift = url.searchParams.get('lift')
		const currentWeek = Number(url.searchParams.get('week'))

		if (!currentLift || !isLiftType(currentLift)) {
			url.searchParams.set('lift', Lifts[0])

			return new Response('Missing lift', {
				status: 302,
				headers: { ...headers, Location: `/?${url.searchParams}` },
			})
		}

		if (!currentWeek || !isWeekType(currentWeek)) {
			url.searchParams.set('week', Weeks[0].toString())

			return new Response('Invalid week', {
				status: 302,
				headers: { ...headers, Location: `/?${url.searchParams}` },
			})
		}

		const kv = await Deno.openKv()
		const result = await kv.get<UserType>(['users', uid])

		const liftData = result.value?.lifts.find((lift) =>
			lift.lift === currentLift
		)

		return ctx.render({
			user: result.value ?? undefined,
			currentLift,
			currentWeek,
			liftData,
		}, { headers })
	},

	async POST(req, ctx) {
		const url = new URL(req.url)
		const cookies = getCookies(req.headers)

		const uid = cookies[CookieName]
		invariant(uid, 'Missing uid')

		const currentLift = url.searchParams.get('lift')
		invariant(currentLift, 'Missing lift')
		invariant(isLiftType(currentLift), 'Invalid lift')

		const data = await req.formData()

		if (data.get('1rm.weight') && data.get('1rm.reps')) {
			saveMax(data, uid, currentLift)
		}

		return new Response('ok', {
			status: 302,
			headers: { Location: `/?${url.searchParams}` },
		})
	},
}

export default function Home({ data }: PageProps<Data>) {
	const { user, currentLift, currentWeek, liftData } = data
	const count = useSignal(3)
	const sets = calcSets(liftData?.oneRepMax?.value ?? 0, currentWeek)

	return (
		<div className='flex flex-col justify-stretch'>
			<LiftSelect currentLift={currentLift} />

			<div className='p-3 bg-orange-400'>
				<form method='post' className='flex flex-col justify-stretch'>
					<OneRepMaxCalculator oneRepMax={liftData?.oneRepMax} />
				</form>
			</div>

			{liftData && (
				<>
					<WeekSelect currentWeek={currentWeek} />

					{sets.map(({ set, lift }) => (
						<div
							className={`p-3 flex justify-between bg-orange-${set}00 text-xl`}
						>
							<h2>Set {set}</h2>
							<div>{lift.weight} x {lift.reps}</div>
						</div>
					))}
				</>
			)}
		</div>
	)
}
