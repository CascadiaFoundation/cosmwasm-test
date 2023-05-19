export const AppConfig = {
  site_name: 'Sidchain',
  title: 'IBCSWAP',
  description: 'Implement inter-chain swap functionality',
  locale: 'en',
  chains: [
    {
      chainID: 'cascadia_6102-1',
      name: 'cascadia',
      prefix: 'cascadia',
      rpcUrl: 'http://localhost:26657',
      restUrl: 'http://localhost:1317',
      denom: 'aCC',
    },
  ],
};

//'http://54.146.100.240:26657',