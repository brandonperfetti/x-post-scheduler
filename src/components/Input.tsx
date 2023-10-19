import clsx from 'clsx'
import type { ComponentPropsWithoutRef } from 'react'
import React, { forwardRef } from 'react'
import { Spinner } from './Spinner'

const defaultElement = 'input'

export interface InputProps {
	variant?: 'primary' | 'secondary' | 'danger'
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
	leftIcon?: JSX.Element
	rightIcon?: JSX.Element
	placeholder?: string
	loading?: boolean
	disabled?: boolean
	readOnly?: boolean
	fullWidth?: boolean
}

type InputElement = 'input' | 'textarea'

type CommonProps = Omit<InputProps, 'onChange'>
type InputSpecificProps = ComponentPropsWithoutRef<'input'>
type TextareaSpecificProps = ComponentPropsWithoutRef<'textarea'>

type ExtendedProps<T extends InputElement> = {
	as?: T
} & CommonProps &
	(T extends 'input' ? InputSpecificProps : TextareaSpecificProps)

export const Input = forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	ExtendedProps<typeof defaultElement>
>(
	(
		{
			as: Element = defaultElement,
			variant = 'primary',
			size = 'md',
			leftIcon,
			rightIcon,
			disabled,
			loading,
			readOnly,
			fullWidth,
			...props
		},
		ref,
	) => {
		if (props.className) {
			throw new Error('You cannot add classnames to the input')
		}

		const commonProps = {
			type: 'text',
			readOnly,
			disabled,
			className: clsx(
				'block w-full appearance-none border shadow-sm focus:outline-none dark:bg-slate-900 dark:text-white focus:ring-0',
				{
					'border-gray-300': variant === 'primary',
					'focus:border-emerald-400':
						variant === 'primary' && !disabled && !readOnly,
					'border-red-300': variant === 'danger',
					'focus:border-red-500':
						variant === 'danger' && !disabled && !readOnly,
					'cursor-not-allowed bg-gray-50': disabled,
					'cursor-default bg-gray-50': readOnly,
					'pl-10': !!leftIcon,
					'pr-10': !!rightIcon,
					'rounded text-xs': size === 'xs',
					'rounded-md text-sm leading-4': size === 'sm',
					'rounded-md sm:text-sm': size === 'md',
					'rounded-md text-base': ['lg', 'xl'].includes(size),
					'rounded-md text-xl': size === '2xl',
					'rounded-md text-2xl': size === '3xl',
				},
				{
					'p-2': ['xs', 'sm', 'md', 'lg'].includes(size),
					'p-3': ['xl', '2xl'].includes(size),
					'p-4': size === '3xl',
				},
			),
			...props,
		}

		return (
			<div className={clsx('relative', { 'w-full': fullWidth })}>
				{!!leftIcon && (
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<div className="h-5 w-5 text-gray-500" aria-hidden>
							{leftIcon}
						</div>
					</div>
				)}
				{Element === 'input' ? (
					<input
						ref={ref as React.Ref<HTMLInputElement>}
						{...(commonProps as InputSpecificProps)}
					/>
				) : (
					<textarea
						ref={ref as React.Ref<HTMLTextAreaElement>}
						{...(commonProps as TextareaSpecificProps)}
					/>
				)}
				{loading && (
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
						<div className="h-5 w-5 text-gray-500" aria-hidden>
							<Spinner showSpinner />
						</div>
					</div>
				)}
				{!!rightIcon && (
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
						<div className="h-5 w-5 text-gray-500" aria-hidden>
							{rightIcon}
						</div>
					</div>
				)}
			</div>
		)
	},
)

Input.displayName = 'Input'
