import { addDays, format, isBefore, parse, set, startOfWeek } from 'date-fns'
export interface DelSelectedCell {
	content?: string
	day_id?: number
	day?: string
	time_id?: number
	time?: string
	published?: boolean
	minutes?: number
}
export interface SelectedCell {
	day_id?: number
	day?: string
	time_id?: number
	time?: string
	minutes?: number
}

export interface Content {
	minutes?: number
	hour?: number
	content?: string
	published?: boolean
	day?: number
	date?: string
}
export interface AvailableScheduleItem {
	time: number
	schedule: Content[][]
}
export const tableHeadings: string[] = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
]

export const availableSchedule: AvailableScheduleItem[] = [
	{
		time: 0,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 1,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 2,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 3,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 4,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 5,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 6,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 7,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 8,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 9,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 10,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 11,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 12,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 13,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 14,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 15,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 16,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 17,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 18,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 19,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 20,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 21,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 22,
		schedule: [[], [], [], [], [], [], []],
	},
	{
		time: 23,
		schedule: [[], [], [], [], [], [], []],
	},
]

export const formatTime = (value: number) => {
	if (value === 0) {
		return `Midnight`
	} else if (value < 10) {
		return `${value}am`
	} else if (value >= 10 && value < 12) {
		return `${value}am`
	} else if (value === 12) {
		return `${value} Noon`
	} else {
		return `${value % 12}pm`
	}
}

export const fetchSchedule = async (
	profile: string,
): Promise<AvailableScheduleItem[]> => {
	try {
		const request = await fetch('/api/schedule/read', {
			method: 'POST',
			body: JSON.stringify({ profile }),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		const response = await request.json()

		const { data } = response
		// console.log(data)
		if (data) {
			// Initialize a new schedule array based on the availableSchedule template
			const newSchedule = availableSchedule.map(item => ({
				time: item.time,
				schedule: item.schedule.map(daySchedule => [...daySchedule]), // Create a new array for each day schedule
			}))

			data.forEach((item: any) => {
				const date = new Date(item.timestamp)
				const formattedDate = format(date, 'yyyy-MM-dd')

				const scheduleItem = {
					time: date.getHours(),
					schedule: {
						content: item.content,
						published: item.published,
						hour: date.getHours(),
						minutes: date.getMinutes(),
						day: item.day_id,
						date: formattedDate,
					},
				}

				const matchingObjIndex = newSchedule.findIndex(
					largeObj => largeObj.time === scheduleItem.time,
				)
				if (matchingObjIndex !== -1) {
					newSchedule[matchingObjIndex].schedule[
						scheduleItem.schedule.day
					].push(scheduleItem.schedule)
				}
			})

			return newSchedule // Return the new schedule array
		}
		return [] // Return an empty array if no data is available
	} catch (err) {
		console.error(err)
		throw err // Propagate the error to the caller
	}
}

export const updateSchedule = async (profile: any, schedule: any) => {
	const { day_id, time, minutes, content, published, timestamp } = schedule
	try {
		await fetch('/api/schedule/create', {
			method: 'POST',
			body: JSON.stringify({
				profile,
				timestamp,
				content,
				published,
				day_id,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
	} catch (err) {
		console.error(err)
		throw err // Propagate the error back to the caller
	}
}

export const deleteSchedule = async (profile: any, schedule: any) => {
	const { day_id, time_id, minutes, content, published, timestamp } = schedule
	try {
		await fetch('/api/schedule/delete', {
			method: 'POST',
			body: JSON.stringify({ profile, timestamp, content }),
			headers: {
				'Content-Type': 'application/json',
			},
		})
	} catch (err) {
		console.error(err)
	}
}

export const getWeekDates = (offset: number) => {
	const now = new Date()
	now.setDate(now.getDate() + offset * 7) // Offset by the number of weeks

	const dates = []
	for (let i = 0; i < 7; i++) {
		const date = new Date(now) // Create a new date object based on the current date
		const diff = i - now.getDay() // Calculate the difference in days to reach the target day from the current day
		date.setDate(now.getDate() + diff) // Update the date value

		// Zero pad the month and day values, and format the date string
		const formattedDate = `${date.getFullYear()}-${String(
			date.getMonth() + 1,
		).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` // yyyy-mm-dd
		dates.push(formattedDate)
	}
	return dates
}

export const convertDate = (dateString: string) => {
	const [year, month, day] = dateString.split('-')
	return `${month}/${day}`
}

export function convertToPrettyDate(dateString: string) {
	const date = parse(dateString, 'yyyy-MM-dd', new Date())
	return format(date, 'MMMM dd, yyyy')
}

export function computeScheduleDate(
	day_id: number,
	time_id: number,
	minute: number,
	weekOffset: number,
): Date {
	const now = new Date()
	const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 0 })
	const targetDate = addDays(startOfCurrentWeek, day_id + weekOffset * 7)

	// Calculate the timezone offset in hours
	let offset = now.getTimezoneOffset() / 60

	// Define the DST transition date
	const dstTransitionDate = new Date(now.getFullYear(), 10, 5) // November 5

	// Check if the target date is after the DST transition date
	if (isBefore(dstTransitionDate, targetDate)) {
		// If yes, adjust the offset by 1 hour
		offset = offset + 1
	}

	// Adjust the time_id by the timezone offset
	const adjustedTimeId = time_id - offset

	// Create a new date object with the adjusted time
	const localDateTime = set(targetDate, {
		hours: adjustedTimeId,
		minutes: minute,
	})

	// console.log('Target Date:', localDateTime)
	return localDateTime
}
