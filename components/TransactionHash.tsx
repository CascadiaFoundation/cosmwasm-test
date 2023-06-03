import clsx from 'clsx'
import { NETWORK } from 'utils/constants'
import { links } from 'utils/links'

import { AnchorButton } from './AnchorButton'
import { StyledInput } from './forms/StyledInput'

interface TransactionHashProps {
  hash: string
  className?: string
}

export const TransactionHash = ({ hash, className }: TransactionHashProps) => {
  return (
    <div
      className={clsx(
        'flex gap-x-2 bg-transparent border border-dark/20 form-input',
        'focus:ring-1 focus:ring-primary-400',
        hash !== '' ? 'text-dark/100' : 'text-dark/50',
        'flex justify-end items-center',
        className,
      )}
    >
      <StyledInput
        className={clsx(
          'flex-auto w-fit',
          'bg-dark/5 border-0 border-dark/20 focus:ring-0 form-input',
          hash !== '' ? 'text-dark/100' : 'text-dark/50',
          className,
        )}
        value={hash || 'Waiting for execution...'}
      />
      <AnchorButton
        className={clsx('ml-2 text-dark', hash === '' ? 'text-dark/30 bg-opacity-20 hover:bg-opacity-10' : '')}
        href={`${links.Explorer}/tx${NETWORK === 'mainnet' ? 's' : ''}/${hash}`}
        onClick={(e) => {
          if (hash === '') e.preventDefault()
        }}
      >
        Go to Explorer
      </AnchorButton>
    </div>
  )
}
