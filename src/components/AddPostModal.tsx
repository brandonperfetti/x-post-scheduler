import {
	AvailableScheduleItem,
	SelectedCell,
	computeScheduleDate,
	tableHeadings,
	updateSchedule,
} from '@/utils/util'
import { Dispatch, FormEventHandler, SetStateAction, useState } from 'react'
import Button from './Button'
import { Input } from './Input'
import { Label } from './Label'
import { Modal } from './Modal'
import { Textarea } from './TextArea'

interface Props {
	setAddEventModal: Dispatch<SetStateAction<boolean>>
	updateYourSchedule: Dispatch<SetStateAction<AvailableScheduleItem[]>>
	addEventModal: boolean
	selectedCell: SelectedCell
	profile: string | any
	yourSchedule: AvailableScheduleItem[]
	weekOffset: number
	fetchAndSetSchedule: () => void
}

const AddPostModal: React.FC<Props> = ({
	setAddEventModal,
	addEventModal,
	selectedCell,
	updateYourSchedule,
	profile,
	yourSchedule,
	weekOffset,
	fetchAndSetSchedule,
}) => {
	const [content, setContent] = useState<string>('')
	const [minute, setMinute] = useState<number>(0)
	const closeModal = () => setAddEventModal(false)
	// console.log(weekOffset)

	const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
		e.preventDefault()
		if (
			Number(minute) < 60 &&
			content.trim().length > 0 &&
			selectedCell.time_id !== undefined &&
			selectedCell.day_id !== undefined
		) {
			const newSchedule = [...yourSchedule]

			const date = computeScheduleDate(
				selectedCell.day_id,
				selectedCell.time_id,
				minute,
				weekOffset,
			)
			// console.log('Date Scheduled:', date)

			const selectedDay =
				newSchedule[selectedCell.time_id].schedule[selectedCell.day_id]
			selectedDay.push({
				content,
				published: false,
				minutes: minute,
				day: selectedCell.day_id,
			})

			// console.log('Selected Day:', selectedDay)

			const newPostDetails = {
				content,
				published: false,
				minutes: minute,
				day_id: selectedCell.day_id,
				time: selectedCell.time_id,
				day: tableHeadings[selectedCell.day_id],
				timestamp: date,
			}

			try {
				await updateSchedule(profile, newPostDetails)
				await fetchAndSetSchedule() // Re-fetch the schedule
				closeModal()
			} catch (error) {
				console.error('Error updating schedule:', error)
			}
		}
	}

	return (
		<Modal
			isOpen={addEventModal}
			onClose={closeModal}
			size="xl" // You can specify the size or other props as required
		>
			<Modal.Title>
				Schedule a post on {selectedCell.day} by {selectedCell.time}
			</Modal.Title>
			<form className="mt-2" onSubmit={handleSubmit}>
				{minute > 59 && (
					<p className="text-red-600">
						Error, please minute must be less than 60
					</p>
				)}
				<Label htmlFor="minute">How many minutes past the hour?</Label>
				<Input
					type="number"
					name="title"
					id="title"
					value={minute.toString()}
					onChange={e => setMinute(parseInt(e.target.value, 10))}
					max={59}
					required
				/>

				<Label htmlFor="content">Post content</Label>
				<Textarea
					name="content"
					id="content"
					value={content}
					rows={5}
					onChange={e => setContent(e.target.value)}
					required
				/>

				<div className="mt-4 flex items-center justify-between space-x-4">
					<Button type="submit">Save</Button>

					<Button type="button" variant="secondary" onClick={closeModal}>
						Cancel
					</Button>
				</div>
			</form>
		</Modal>
	)
}

export default AddPostModal
