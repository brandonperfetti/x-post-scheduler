'use client'
import AddEventModal from '@/components/AddPostModal'
import Button from '@/components/Button'
import DeleteEventModal from '@/components/DeletePostModal'
import { Modal } from '@/components/Modal'
import { Table } from '@/components/Table'
import {
	Content,
	DelSelectedCell,
	SelectedCell,
	availableSchedule,
	convertDate,
	convertToPrettyDate,
	fetchSchedule,
	formatTime,
	getWeekDates,
	tableHeadings,
} from '@/utils/util'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import React, { useCallback, useEffect, useState } from 'react'
import { FaClock } from 'react-icons/fa6'

const Dashboard = () => {
	const [weekOffset, setWeekOffset] = useState(0)
	const [yourSchedule, updateYourSchedule] = useState(availableSchedule)
	const [isLoading, setIsLoading] = useState(true)
	const [username, setUsername] = useState<string>('')
	const [addEventModal, setAddEventModal] = useState(false)
	const [deleteEventModal, setDeleteEventModal] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [dateError, setDateError] = useState<string | null>(null)
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

	// console.log('weekOffset', weekOffset)
	const weekDates = getWeekDates(weekOffset)
	const [selectedCell, setSelectedCell] = useState<SelectedCell>({
		day_id: 0,
		day: '',
		time_id: 0,
		time: '',
	})
	const [delSelectedCell, setDelSelectedCell] = useState<DelSelectedCell>({
		content: '',
		day_id: 0,
		day: '',
		published: false,
		time_id: 0,
		time: '',
		minutes: 0,
	})

	const resetToCurrentWeek = () => {
		setWeekOffset(0)
	}

	const handleAddEvent = useCallback(
		(id: number, time: number) => {
			// Get the user's time zone
			const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

			// Construct a string representing the selected date and time in the user's time zone
			const selectedDateTimeStr = `${weekDates[id]}T${String(time).padStart(
				2,
				'0',
			)}:00:00`

			// Convert the selected date and time to a Date object in UTC
			const selectedDateTimeUtc = zonedTimeToUtc(selectedDateTimeStr, timeZone)

			// Get the current date and time in UTC
			const nowUtc = new Date()

			// Compare the selected date and time to the current date and time
			if (selectedDateTimeUtc < nowUtc) {
				setDateError('You cannot schedule a post in the past.')
				setIsErrorModalOpen(true) // Open the error modal
				return
			}

			setDateError(null)
			setSelectedCell({
				day_id: id,
				day: tableHeadings[id],
				time_id: time,
				time: format(selectedDateTimeUtc, 'hh:mm a'), // Format the time for display
			})
			setAddEventModal(true)
		},
		[weekDates],
	)

	const handleDeleteEvent = useCallback(
		(
			e: React.MouseEvent<HTMLParagraphElement>,
			content: Content,
			time: number,
		) => {
			e.stopPropagation()
			if (content.day !== undefined) {
				setDelSelectedCell({
					content: content.content,
					day_id: content.day,
					day: tableHeadings[content.day],
					published: content.published,
					time_id: time,
					time: formatTime(time),
					minutes: content.minutes,
				})
				setDeleteEventModal(true)
			}
		},
		[],
	)

	const handleLogout = () => {
		localStorage.removeItem('username')
		setUsername('')
		window.location.href = '/'
	}

	const sendAuthRequest = useCallback(async (code: string | null) => {
		if (!code) {
			console.error('Code is missing or null')
			return
		}
		try {
			const request = await fetch('/api/twitter/auth', {
				method: 'POST',
				body: JSON.stringify({ code }),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (!request.ok) {
				throw new Error(`Server responded with ${request.status}`)
			}
			const response = await request.json()
			if (response.token_type && response.data.username) {
				localStorage.setItem('username', response.data.username)
				setUsername(response.data.username)
			} else {
				throw new Error('Unexpected response format')
			}
		} catch (err) {
			console.error('Error:', err)
			console.error(
				'Error details:',
				(err as any).response
					? await (err as any).response.json()
					: 'No response',
			)
			setError((err as Error).message)
		}
	}, [])

	useEffect(() => {
		const fetchAndSetSchedule = async () => {
			setIsLoading(true)
			const userName = localStorage.getItem('username')
			if (userName) {
				setUsername(userName)
				try {
					const newSchedule = await fetchSchedule(userName)
					updateYourSchedule(newSchedule)
				} catch (error) {
					console.error(error)
				}
			} else {
				const params = new URL(window.location.href).searchParams
				const code = params.get('code')
				if (code) {
					await sendAuthRequest(code)
					const updatedUserName = localStorage.getItem('username')
					if (updatedUserName) {
						try {
							const newSchedule = await fetchSchedule(updatedUserName)
							updateYourSchedule(newSchedule)
						} catch (error) {
							console.error(error)
						}
					}
				}
			}
			setIsLoading(false)
		}

		fetchAndSetSchedule()
	}, [sendAuthRequest])

	const fetchAndSetSchedule = async () => {
		setIsLoading(true)
		try {
			const newSchedule = await fetchSchedule(username)
			updateYourSchedule(newSchedule)
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	// turned this off to avoid a screen flash after adding a post to the schedule
	// if (isLoading) {
	// 	return <Spinner showSpinner />
	// }

	return (
		<main className="w-full min-h-screen dark:bg-slate-700">
			<header className="w-full flex items-center mb-6">
				<div className="flex items-center justify-center w-full ml-28 pl-10">
					<h2 className="text-center font-extrabold text-3xl mt-6 mr-2 dark:text-white">
						Your Scheduled X Posts
					</h2>
					<FaClock className="text-3xl mt-6 text-blue-500" />
				</div>
				<div className="w-fit float-right px-8 mt-6">
					<Button onClick={handleLogout} variant="danger">
						Logout
					</Button>
				</div>
			</header>

			<div className="flex w-full justify-center dark:text-white">
				{convertToPrettyDate(weekDates[0])} -{' '}
				{convertToPrettyDate(weekDates[6])}
			</div>
			<div className=" p-8">
				<div className="flex justify-center mb-4">
					<button onClick={() => setWeekOffset(weekOffset - 1)}>
						<ChevronLeftIcon className="h-8 w-8 dark:text-white hover:text-emerald-500" />
					</button>
					<button
						onClick={resetToCurrentWeek}
						className="ml-4 dark:text-white hover:text-emerald-500"
					>
						Reset to Current Week
					</button>
					<button
						onClick={() => setWeekOffset(weekOffset + 1)}
						className="ml-4"
					>
						<ChevronRightIcon className="h-8 w-8 dark:text-white hover:text-emerald-500" />
					</button>
				</div>
				<div className="w-full h-[75vh] overflow-y-scroll rounded-lg shadow-md">
					<Table>
						<Table.Head>
							<Table.Row>
								<Table.Header>Time</Table.Header>
								{tableHeadings.map((day, index) => (
									<Table.Header align={'center'} key={index}>
										{day} {convertDate(weekDates[index])}
									</Table.Header>
								))}
							</Table.Row>
						</Table.Head>
						<Table.Body>
							{yourSchedule.map((item, index) => (
								<Table.Row key={`${item.time}_${index}`}>
									<Table.Data>{formatTime(item.time)}</Table.Data>
									{item.schedule.map((sch, id) => (
										<Table.Data
											key={`${id}_${item.time}`}
											onClick={() => handleAddEvent(id, item.time)}
											className="cursor-pointer"
										>
											{sch.map((content, ind: number) => {
												const columnDate = weekDates[id]
												const contentDate = content.date
												if (content.day === id && contentDate === columnDate) {
													// console.log(content)
													// console.log('Content Date', contentDate)
													// console.log('Column Date', columnDate)
													return (
														<div
															key={`post_${content.day}_${content.hour}_${content.minutes}_${ind}`}
															onClick={e =>
																handleDeleteEvent(e, content, item.time)
															}
															className={`p-3 ${
																content.published
																	? 'bg-pink-600 hover:bg-pink-500'
																	: 'bg-emerald-600 hover:bg-emerald-500'
															}  mb-2 rounded-md text-xs cursor-pointer`}
														>
															<p className="text-gray-700 mb-2">
																{' '}
																{content.minutes === 0
																	? "o'clock"
																	: `at ${content.minutes} minutes past`}
															</p>
															<p className=" text-white">{content.content}</p>
														</div>
													)
												}
												return null
											})}
										</Table.Data>
									))}
								</Table.Row>
							))}
						</Table.Body>
					</Table>
				</div>
				{addEventModal && (
					<AddEventModal
						weekOffset={weekOffset}
						setAddEventModal={setAddEventModal}
						addEventModal={addEventModal}
						selectedCell={selectedCell}
						yourSchedule={yourSchedule}
						updateYourSchedule={updateYourSchedule}
						profile={username}
						fetchAndSetSchedule={fetchAndSetSchedule}
					/>
				)}
				{deleteEventModal && (
					<DeleteEventModal
						setDeleteEventModal={setDeleteEventModal}
						deleteEventModal={deleteEventModal}
						delSelectedCell={delSelectedCell}
						yourSchedule={yourSchedule}
						updateYourSchedule={updateYourSchedule}
						profile={username}
					/>
				)}
			</div>
			{error && <div className="error-message">{error}</div>}
			{dateError && (
				<Modal
					isOpen={isErrorModalOpen}
					onClose={() => {
						setIsErrorModalOpen(false)
						setDateError(null) // Reset the dateError state
					}}
				>
					<Modal.Title>
						<span className="text-red-500">Error</span>
					</Modal.Title>
					<div className="dark:text-white">{dateError}</div>
				</Modal>
			)}
		</main>
	)
}

export default Dashboard
