import clsx from 'clsx'
import type { ComponentProps } from 'react'

export const TextArea = (props: ComponentProps<'textarea'>) => {
  const { className, ...rest } = props
  return (
    <textarea
      className={clsx(
        'bg-transparent border border-dark/20 form-input',
        'placeholder:text-dark/50',
        'focus:ring-1 focus:ring-primary-400',
        className,
      )}
      {...rest}
    />
  )
}
