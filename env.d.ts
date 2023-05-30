/* eslint-disable import/no-default-export */

declare module '*.svg' {
  const Component: (props: import('react').SVGProps<SVGSVGElement>) => JSX.Element
  export default Component
}

declare module 'react-datetime-picker/dist/entry.nostyle' {
  export { default } from 'react-datetime-picker'
  export * from 'react-datetime-picker'
}

declare namespace NodeJS {
  declare interface ProcessEnv {
    readonly APP_VERSION: string

    readonly NEXT_PUBLIC_CW1_SUBKEYS_CODE_ID: string
    readonly NEXT_PUBLIC_CW20_BASE_CODE_ID: string
    readonly NEXT_PUBLIC_CW20_BONDING_CODE_ID: string
    readonly NEXT_PUBLIC_CW20_MERKLE_DROP_CODE_ID: string
    readonly NEXT_PUBLIC_CW20_STAKING_CODE_ID: string
    readonly NEXT_PUBLIC_CW721_BASE_CODE_ID: string

    readonly NEXT_PUBLIC_API_URL: string
    readonly NEXT_PUBLIC_BLOCK_EXPLORER_URL: string
    readonly NEXT_PUBLIC_ESCROW_AMOUNT: string
    readonly NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS: string
    readonly NEXT_PUBLIC_NETWORK: string
    readonly NEXT_PUBLIC_WEBSITE_URL: string
    readonly NEXT_PUBLIC_AIRDROP_ACCOUNT_LIMIT: string

    readonly NEXT_PUBLIC_S3_BUCKET: string
    readonly NEXT_PUBLIC_S3_ENDPOINT: string
    readonly NEXT_PUBLIC_S3_KEY: string
    readonly NEXT_PUBLIC_S3_REGION: string
    readonly NEXT_PUBLIC_S3_SECRET: string


    readonly NEXT_PUBLIC_CHAIN_ID:string
    readonly NEXT_PUBLIC_CHAIN_NAME:string
    readonly NEXT_PUBLIC_ADDRESS_PREFIX:string
    readonly NEXT_PUBLIC_RPC_URL:string
    readonly NEXT_PUBLIC_REST_URL:string
    readonly NEXT_PUBLIC_HTTP_URL:string 
    readonly NEXT_PUBLIC_FAUCET_URL:string 
    readonly NEXT_PUBLIC_FEE_TOKEN:string
    readonly NEXT_PUBLIC_STAKING_TOKEN:string
    readonly NEXT_PUBLIC_MAIN_DENOM:string
    readonly NEXT_PUBLIC_MAIN_DENOM_FRACTIONAL_DIGITS:number
    readonly NEXT_PUBLIC_GAS_PRICE:number
    readonly NEXT_PUBLIC_FEE_UPLOAD:number
    readonly NEXT_PUBLIC_FEE_INIT:number
    readonly NEXT_PUBLIC_FEE_EXECUTE:number
  }
}

type KeplrWindow = import('@keplr-wallet/types/src/window').Window

declare interface Window extends KeplrWindow {
  confetti?: (obj: any) => void
}

declare const __DEV__: boolean
declare const __PROD__: boolean

/* eslint-enable import/no-default-export */
