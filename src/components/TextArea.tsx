import clsx from 'clsx'
import * as React from 'react'
import { Spinner } from './Spinner'

const defaultElement = 'textarea'

export interface TextAreaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	variant?: 'primary' | 'secondary' | 'danger'
	loading?: boolean
	disabled?: boolean
	readOnly?: boolean
	fullWidth?: boolean
}

type TextAreaElement = 'textarea'
type CommonProps = Omit<TextAreaProps, 'onChange'>
type TextareaSpecificProps = React.ComponentPropsWithoutRef<'textarea'>

type ExtendedProps<T extends TextAreaElement> = {
	as?: T
} & CommonProps &
	(T extends 'textarea' ? TextareaSpecificProps : never)

const Textarea = React.forwardRef<
	HTMLTextAreaElement,
	ExtendedProps<typeof defaultElement>
>(
	(
		{
			as: Element = defaultElement,
			className,
			variant = 'primary',
			disabled,
			loading,
			readOnly,
			fullWidth,
			...props
		},
		ref,
	) => {
		const textareaStyles = clsx(
			'block w-full appearance-none border shadow-sm focus:outline-none dark:bg-slate-900 dark:text-white p-2 focus:ring-0 rounded',
			{
				'border-gray-300': variant === 'primary',
				'focus:border-emerald-400':
					variant === 'primary' && !disabled && !readOnly,
				'border-red-300': variant === 'danger',
				'focus:border-red-500': variant === 'danger' && !disabled && !readOnly,
				'cursor-not-allowed bg-gray-50': disabled,
				'cursor-default bg-gray-50': readOnly,
			},
		)

		return (
			<div className={clsx('relative', { 'w-full': fullWidth })}>
				<textarea className={textareaStyles} ref={ref} {...props} />
				{loading && (
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
						<div className="h-5 w-5 text-gray-500" aria-hidden>
							<Spinner showSpinner />
						</div>
					</div>
				)}
			</div>
		)
	},
)
Textarea.displayName = 'Textarea'

export { Textarea }
