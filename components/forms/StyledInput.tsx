import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { forwardRef } from 'react'

export const StyledInput = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  function Input({ className, ...rest }, ref) {
    return (
      <input
        className={clsx(
          'bg-transparent border border-dark/20 form-input',
          'placeholder:text-dark/50',
          'focus:ring-1 focus:ring-primary-300',
          className,
        )}
        ref={ref}
        {...rest}
      />
    )
  },
  //
)
