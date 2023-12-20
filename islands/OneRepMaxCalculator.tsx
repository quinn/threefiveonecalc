import { useSignal } from '@preact/signals'
import type { OneRepMax } from '../types/index.ts'
import { Button } from '../components/Button.tsx'

interface Props {
	oneRepMax?: OneRepMax
}

export function OneRepMaxCalculator({ oneRepMax }: Props) {
	const edit = useSignal<boolean>(false)

	return (
		<>
			{edit.value || !oneRepMax?.value
				? (
					<>
						<h1>One Rep Max Calculator</h1>

						<label class='flex justify-between items-center mb-1'>
							Weight
							<input
								class='px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors'
								name='1rm.weight'
								type='number'
								value={oneRepMax?.input.weight}
							/>
						</label>
						<br />
						<label class='flex justify-between items-center mb-1'>
							Reps
							<input
								class='px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-gray-200 transition-colors'
								name='1rm.reps'
								type='number'
								value={oneRepMax?.input.reps}
							/>
						</label>
						<br />

						<Button type='submit'>Submit</Button>
					</>
				)
				: (
					<div className='flex items-center justify-between'>
						<h2>1RM: {oneRepMax.value}</h2>
						<Button onClick={() => edit.value = true}>Edit</Button>
					</div>
				)}
		</>
	)
}
