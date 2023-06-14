import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { forwardRef } from 'react'

export const StyledTextArea = forwardRef<HTMLTextAreaElement, ComponentProps<'textarea'>>(
  function Input({ className, ...rest }, ref) {
    return (
      <textarea
        className={clsx(
          'bg-transparent border border-dark/20 form-input',
          'placeholder:text-dark/50',
          'focus:ring-1 focus:ring-primary-400',
          className,
        )}
        ref={ref}
        {...rest}
      />
    )
  },
  //
)
