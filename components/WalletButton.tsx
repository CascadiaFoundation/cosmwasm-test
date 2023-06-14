import clsx from 'clsx'
import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { BiWallet } from 'react-icons/bi'
import { FaSpinner } from 'react-icons/fa'

export interface WalletButtonProps extends ComponentProps<'button'> {
  isLoading?: boolean
}

export const WalletButton = forwardRef<HTMLButtonElement, WalletButtonProps>(function WalletButton(
  { className, children, isLoading, ...props },
  ref,
) {
  return (
    <button
      className={clsx(
        'flex gap-x-4 items-center text-sm font-bold text-primary-400 uppercase truncate', // content styling
        'py-2 px-4 border border-primary-400', // button styling
        'hover:bg-primary-400/10 transition-colors', // hover styling
        { 'cursor-wait': isLoading }, // loading styling
        className,
      )}
      ref={ref}
      type="button"
      {...props}
    >
      {isLoading ? <FaSpinner className="animate-spin" size={16} /> : <BiWallet size={16} />}
      <div className="flex">{isLoading ? 'Loading...' : children}</div>
    </button>
  )
})
