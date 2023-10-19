import { ForwardedRef, forwardRef } from 'react'

export const Label = forwardRef(function Label(
	props: Omit<JSX.IntrinsicElements['label'], 'className'>,
	ref: ForwardedRef<HTMLLabelElement>,
) {
	return (
		// eslint-disable-next-line jsx-a11y/label-has-associated-control
		<label
			ref={ref}
			{...props}
			className="text-xs font-medium text-gray-500 dark:text-white"
		/>
	)
})
