import { createRef } from 'preact'
import { Lifts, LiftType } from '../types/index.ts'

interface Props {
	currentLift: LiftType
}

export function LiftSelect({ currentLift }: Props) {
	const formRef = createRef<HTMLFormElement>()

	return (
		<form ref={formRef}>
			<input
				type='hidden'
				name='week'
				value={(location && new URL(location.href).searchParams.get('week')) ??
					'1'}
			/>
			<select
				name='lift'
				onChange={() => formRef.current?.submit()}
				className='w-full text-2xl'
			>
				{Lifts.map((lift) => (
					<option value={lift} selected={lift === currentLift}>
						{lift}
					</option>
				))}
			</select>
		</form>
	)
}
