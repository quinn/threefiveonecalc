import { createRef } from 'preact'
import { Weeks, WeekType } from '../types/index.ts'

interface Props {
	currentWeek: WeekType
}

export function WeekSelect({ currentWeek }: Props) {
	const formRef = createRef<HTMLFormElement>()

	return (
		<form ref={formRef}>
			<input
				type='hidden'
				name='lift'
				value={(location && new URL(location.href).searchParams.get('lift')) ??
					'Squat'}
			/>

			<select
				name='week'
				onChange={() => formRef.current?.submit()}
				className='w-full text-2xl'
			>
				{Weeks.map((week) => (
					<option value={week} selected={week === currentWeek}>
						Week {week}
					</option>
				))}
			</select>
		</form>
	)
}
