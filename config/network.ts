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
  chainId: 'cascadia_6102-1',
  chainName: 'cascadia',
  addressPrefix: 'cascadia',
  rpcUrl: 'http://localhost:26657',
  restUrl: 'http://localhost:1317',
  httpUrl: 'http://localhost:1317',
  faucetUrl: 'http://localhost:4500',
  feeToken: 'aCC',
  stakingToken: 'aCC',
  coinMap: {
    aCC: { denom: 'aCC', fractionalDigits: 0 },
    CC: { denom: 'aCC', fractionalDigits: 18 }
  },
  gasPrice: 200000,
  fees: {
    upload: 140000000000,
    init: 500000,
    exec: 200000,
  },
}

export const getConfig = (network: string): AppConfig => {
  //if (network === 'mainnet') return mainnetConfig
  return uniTestnetConfig
}
