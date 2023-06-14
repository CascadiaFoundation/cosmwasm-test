import clsx from 'clsx'
import { toggleSidebar, useSidebarStore } from 'contexts/sidebar'
import type { ReactNode } from 'react'
import { FaChevronLeft } from 'react-icons/fa'

export interface SidebarLayoutProps {
  children: ReactNode
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const { isOpen } = useSidebarStore()

  return (
    <div className={clsx(isOpen ? 'min-w-[250px] max-w-[250px]' : 'min-w-[20px] max-w-[20px]', 'relative z-10')}>
      {/* fixed component */}
      <div
        className={clsx(
          'overflow-auto fixed top-0 left-0 min-w-[250px] max-w-[250px] no-scrollbar',
          'border-r-[1px] border-primary-300',
          { 'translate-x-[-230px]': !isOpen },
        )}
      >
        {/* inner component */}
        <div
          className={clsx('flex flex-col gap-y-2 p-8 min-h-screen font-bold text-primary-400', {
            invisible: !isOpen,
          })}
        >
          {children}
        </div>
      </div>

      {/* sidebar toggle */}
      <button
        className={clsx(
          'absolute top-[32px] right-[-12px] p-1 w-[24px] h-[24px]',
          'text-white bg-primary-400 rounded-full',
          'hover:bg-primary-300',
        )}
        onClick={toggleSidebar}
        type="button"
      >
        <FaChevronLeft className={clsx('mx-auto', { 'rotate-180': !isOpen })} size={12} />
      </button>
    </div>
  )
}
