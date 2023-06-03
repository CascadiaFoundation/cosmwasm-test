import clsx from 'clsx'
import { Anchor } from 'components/Anchor'
import { useWallet } from 'contexts/wallet'
import { useRouter } from 'next/router'
import BrandText from 'public/brand/brand-text.svg'
import { AiOutlineCloudUpload, AiOutlineDatabase, AiOutlineKey } from 'react-icons/ai'
import { NETWORK } from 'utils/constants'
import { footerLinks, links, socialsLinks } from 'utils/links'

import { SidebarLayout } from './SidebarLayout'
import { WalletLoader } from './WalletLoader'

const routes = [
  // { text: 'Airdrops', href: `/airdrops` },
  { text: 'Upload Contract', href: `/contracts/upload`, icon: <AiOutlineCloudUpload /> },
  { text: 'CW1 Subkeys', href: `/contracts/cw1/subkeys`, icon: <AiOutlineKey /> },
  { text: 'CW20 Base', href: `/contracts/cw20/base`, icon: <AiOutlineDatabase /> },
  { text: 'CW721 Base', href: `/contracts/cw721/base`, icon: <AiOutlineDatabase /> },
  { text: 'General', href: `/contracts/general`, icon: <AiOutlineDatabase /> },
  { text: 'Sign and Verify', href: `/sign-verify`, icon: <AiOutlineCloudUpload /> },
  { text: 'Token Faucet', href: `/request-tokens`, icon: <AiOutlineCloudUpload /> },
]

export const Sidebar = () => {
  const router = useRouter()
  const wallet = useWallet()

  return (
    <SidebarLayout>
      {/* cascadiad brand as home button */}
      <Anchor href="/" onContextMenu={(e) => [e.preventDefault(), router.push('/brand')]}>
        <BrandText className="text-plumbus hover:text-plumbus-light transition" />
      </Anchor>

      {/* wallet button */}
      <WalletLoader />

      {/* main navigation routes */}
      {routes.map(({ icon, text, href }) =>
        NETWORK === 'testnet' ? (
          <Anchor
            key={href}
            className={clsx(
              'py-2 px-4 -mx-4 uppercase', // styling
              'hover:bg-primary-400/30 transition-colors', // hover styling
              { 'font-bold text-plumbus': router.asPath.startsWith(href) }, // active route styling
              // { 'text-gray-500 pointer-events-none': disabled }, // disabled route styling
            )}
            href={href}
          >
            <div className="flex gap-2 items-center py-1 px-2 hover:bg-primary-400/30">
              {icon} {text}
            </div>
          </Anchor>
        ) : (
          text !== 'Token Faucet' && (
            <Anchor
              key={href}
              className={clsx(
                'py-2 px-4 -mx-4 uppercase', // styling
                'hover:bg-white/5 transition-colors', // hover styling
                { 'font-bold text-plumbus': router.asPath.startsWith(href) }, // active route styling
                // { 'text-gray-500 pointer-events-none': disabled }, // disabled route styling
              )}
              href={href}
            >
              <div className="flex gap-2 items-center">
                {icon} {text}
              </div>
            </Anchor>
          )
        ),
      )}

      <div className="flex-grow" />

      {/* cascadiad network status */}
      <div className="text-sm">Network: {wallet.network}</div>

      {/* footer reference links */}
      <ul className="text-sm list-disc list-inside">
        {footerLinks.map(({ href, text }) => (
          <li key={href}>
            <Anchor className="hover:text-plumbus hover:underline" href={href}>
              {text}
            </Anchor>
          </li>
        ))}
      </ul>

      {/* footer attribution */}
      <div className="text-xs text-dark/50">
        CascadiaTools {process.env.APP_VERSION} <br />
        Made by{' '}
        <Anchor className="text-plumbus hover:underline" href={links.deuslabs}>
          deus labs
        </Anchor>
      </div>

      {/* footer social links */}
      <div className="flex gap-x-6 items-center text-dark/75">
        {socialsLinks.map(({ Icon, href, text }) => (
          <Anchor key={href} className="hover:text-plumbus" href={href}>
            <Icon aria-label={text} size={20} />
          </Anchor>
        ))}
      </div>
    </SidebarLayout>
  )
}
