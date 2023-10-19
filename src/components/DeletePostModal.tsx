'use client'
import { Dispatch, SetStateAction } from 'react'
import {
	AvailableScheduleItem,
	DelSelectedCell,
	deleteSchedule,
} from '../utils/util'
import Button from './Button'
import { Modal } from './Modal'

interface Props {
	setDeleteEventModal: Dispatch<SetStateAction<boolean>>
	deleteEventModal: boolean
	delSelectedCell: DelSelectedCell
	profile: string | any
	yourSchedule: AvailableScheduleItem[]
	updateYourSchedule: Dispatch<SetStateAction<AvailableScheduleItem[]>>
}

const DeletePostModal: React.FC<Props> = ({
	setDeleteEventModal,
	deleteEventModal,
	delSelectedCell,
	yourSchedule,
	updateYourSchedule,
	profile,
}) => {
	const closeModal = () => setDeleteEventModal(false)
	// console.log(delSelectedCell)

	const handleDelete = () => {
		if (
			delSelectedCell.time_id !== undefined &&
			delSelectedCell.day_id !== undefined
		) {
			const initialSchedule = [...yourSchedule]
			let selectedDay =
				initialSchedule[delSelectedCell.time_id].schedule[
					delSelectedCell.day_id
				]
			const updatedPosts = selectedDay.filter(
				day =>
					day.content !== delSelectedCell.content &&
					day.minutes !== delSelectedCell.minutes,
			)
			initialSchedule[delSelectedCell.time_id].schedule[
				delSelectedCell.day_id
			] = updatedPosts
			const deletePostDetails = {
				username: localStorage.getItem('username'),
				content: delSelectedCell.content,
				day_id: delSelectedCell.day_id,
				day: delSelectedCell.day,
				time_id: delSelectedCell.time_id,
				time: delSelectedCell.time,
				minutes: delSelectedCell.minutes,
				published: delSelectedCell.published,
			}
			deleteSchedule(profile, deletePostDetails)
			updateYourSchedule(initialSchedule)
			closeModal()
		}
	}

	return (
		<Modal
			isOpen={deleteEventModal}
			onClose={closeModal}
			size="md" // Adjust the size as needed
		>
			<Modal.Title>Delete post</Modal.Title>
			<div className="mt-2">
				<p className="mb-3 dark:text-white">Are you sure you want to delete?</p>
				<p className="text-sm text-gray-500">
					{`"${delSelectedCell.content}" scheduled for ${delSelectedCell.day} at ${delSelectedCell.time_id}:${delSelectedCell.minutes}`}
				</p>
			</div>

			<div className="mt-4 flex items-center justify-between space-x-4">
				<Button variant="danger" onClick={handleDelete}>
					Delete
				</Button>
				<Button variant="secondary" onClick={closeModal}>
					Cancel
				</Button>
			</div>
		</Modal>
	)
}

export default DeletePostModal
