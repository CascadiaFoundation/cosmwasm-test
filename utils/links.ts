import { ImGithub, ImTwitter } from 'react-icons/im'
import { SiDiscord, SiTelegram } from 'react-icons/si'

import { BLOCK_EXPLORER_URL } from './constants'

export const links = {
  // main links
  deuslabs: `https://cascadia.fi`,
  Discord: `https://cascadia.gg/cascadiad`,
  Docs: `https://cascadia.cascadiad.tools`,
  GitHub: `https://github.com/CosmosContracts/cascadiad-tools`,
  Cascadia: `https://cascadia.io`,
  Telegram: `https://t.me/cascadia`,
  Twitter: `https://twitter.com/cascadia`,
  Explorer: BLOCK_EXPLORER_URL,
  'Docs CW1 Subkeys': ``,
  'Docs CW20 Base': ``,
  'Docs CW721 Base': ``

}

export const footerLinks = [
  { text: 'Block Explorer', href: links.Explorer },
  { text: 'Documentation', href: links.Docs },
  { text: 'Submit an issue', href: `${links.GitHub}/issues/new/choose` },
  { text: 'Powered by Cascadia', href: links.Cascadia },
]

export const legacyNavbarLinks = [
  { text: 'CW20 - Soon', href: `/contracts/cw20`, disabled: true },
  { text: 'CW1 - Soon', href: `/contracts/cw1`, disabled: true },
  { text: 'CW721 - Soon', href: `/contracts/cw721`, disabled: true },
]

export const socialsLinks = [
  { text: 'Discord', href: links.Discord, Icon: SiDiscord },
  { text: 'GitHub', href: links.GitHub, Icon: ImGithub },
  { text: 'Telegram', href: links.Telegram, Icon: SiTelegram },
  { text: 'Twitter', href: links.Twitter, Icon: ImTwitter },
]
