import clsx from 'clsx'
import Head from 'next/head'
import type { ReactNode } from 'react'
import { FaDesktop } from 'react-icons/fa'
import type { PageMetadata } from 'utils/layout'

import { DefaultAppSeo } from './DefaultAppSeo'
// import { Issuebar } from './Issuebar'
import { Sidebar } from './Sidebar'

export interface LayoutProps {
  metadata?: PageMetadata
  children: ReactNode
}

export const Layout = ({ children, metadata = {} }: LayoutProps) => {
  return (
    <div className="relative overflow-hidden">
      <Head>
        <meta content="minimum-scale=1, initial-scale=1, width=device-width" name="viewport" />
      </Head>

      <DefaultAppSeo />

      {/* plumbus confetti */}
      <div className="fixed inset-0 pointer-events-none -z-10 cascadiad-gradient-bg">
        
      </div>

      {/* actual layout container */}
      <div className="hidden sm:flex">
        <Sidebar />
        <div className="relative flex-grow h-screen overflow-auto no-scrollbar">
          <main
            className={clsx('mx-auto max-w-7xl', {
              'flex flex-col justify-center items-center':
                typeof metadata.center === 'boolean' ? metadata.center : true,
            })}
          >
            {children}
          </main>
        </div>
        {/* <Issuebar /> */}
      </div>

      <div className="flex flex-col items-center justify-center h-screen p-8 space-y-4 text-center bg-black/50 sm:hidden">
        <FaDesktop size={48} />
        <h1 className="text-2xl font-bold">Unsupported Viewport</h1>
        <p>
          CascadiaTools is best viewed on the big screen.
          <br />
          Please open CascadiaTools on your tablet or desktop browser.
        </p>
      </div>
    </div>
  )
}
