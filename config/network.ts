import type { AppConfig } from './app'

// export const mainnetConfig: AppConfig = {
//   chainId: 'cascadia_6102-1',
//   chainName: 'Cascadia',
//   addressPrefix: 'cascadia',  
//   rpcUrl: 'http://localhost:26657',
//   restUrl: 'http://localhost:1317',
//   httpUrl: 'http://localhost:1317',
//   feeToken: 'aCC',
//   stakingToken: 'aCC',
//   coinMap: {
//     aCC: { denom: 'aCC', fractionalDigits: 0 },
//     CC: { denom: 'aCC', fractionalDigits: 18 }
//   },
//   gasPrice: 0.025,
//   fees: {
//     upload: 1500000,
//     init: 500000,
//     exec: 200000,
//   },
// }

export const uniTestnetConfig: AppConfig = {
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
  chainName: process.env.NEXT_PUBLIC_CHAIN_NAME,
  addressPrefix: process.env.NEXT_PUBLIC_ADDRESS_PREFIX,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
  restUrl: process.env.NEXT_PUBLIC_REST_URL,
  httpUrl: process.env.NEXT_PUBLIC_HTTP_URL,
  faucetUrl: process.env.NEXT_PUBLIC_FAUCET_URL,
  feeToken: process.env.NEXT_PUBLIC_FEE_TOKEN,
  stakingToken: process.env.NEXT_PUBLIC_STAKING_TOKEN,
  coinMap: {
    aCC: { denom: process.env.NEXT_PUBLIC_FEE_TOKEN, fractionalDigits: 0 },
    CC: { denom:  process.env.NEXT_PUBLIC_MAIN_DENOM, fractionalDigits: process.env.NEXT_PUBLIC_MAIN_DENOM_FRACTIONAL_DIGITS }
  },
  gasPrice: process.env.NEXT_PUBLIC_GAS_PRICE,
  fees: {
    upload: process.env.NEXT_PUBLIC_FEE_UPLOAD,
    init: process.env.NEXT_PUBLIC_FEE_INIT,
    exec: process.env.NEXT_PUBLIC_FEE_EXECUTE,
  },
}

export const getConfig = (network: string): AppConfig => {
  //if (network === 'mainnet') return mainnetConfig
  console.log("config----", uniTestnetConfig)
  return uniTestnetConfig
}
