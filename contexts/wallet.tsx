import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Decimal } from '@cosmjs/math'
import type { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing'
import { Registry } from '@cosmjs/proto-signing'
import type { Coin } from '@cosmjs/stargate'
import { AminoTypes, defaultRegistryTypes } from '@cosmjs/stargate'
import { cosmwasmAminoConverters, cosmwasmProtoRegistry } from 'codegen/cosmwasm/client'
import { ibcAminoConverters, ibcProtoRegistry } from 'codegen/ibc/client'
import type { AppConfig } from 'config'
import { getConfig, keplrConfig } from 'config'
import fetchAccount from 'http/get/fetchAccount'
import fetchBalances from 'http/get/fetchBalance'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { createTrackedSelector } from 'react-tracked'
import { NETWORK } from 'utils/constants'
import SigningKeplrCosmWasmClient from 'utils/signingKeplrCosmWasmClient'
import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
/**
 * Keplr wallet store type definitions, merged from previous kepler ctx and
 * previous wallet ctx.
 *
 * - previous keplr ctx: https://github.com/CosmosContracts/cascadiad-tools/blob/41c256f71d2b8b55fade12fae3b8c6a493a1e3ce/services/keplr.ts
 * - previous wallet ctx: https://github.com/CosmosContracts/cascadiad-tools/blob/41c256f71d2b8b55fade12fae3b8c6a493a1e3ce/contexts/wallet.tsx
 */
export interface KeplrWalletStore {
  accountNumber: number
  address: string
  balance: Coin[]
  client: SigningKeplrCosmWasmClient | undefined
  config: AppConfig
  initialized: boolean
  initializing: boolean
  name: string
  network: string
  signer: OfflineSigner | undefined

  /** https://github.com/CosmosContracts/cascadiad-tools/blob/41c256f71d2b8b55fade12fae3b8c6a493a1e3ce/contexts/wallet.tsx#L69-L72 */
  readonly clear: () => void

  /** https://github.com/CosmosContracts/cascadiad-tools/blob/41c256f71d2b8b55fade12fae3b8c6a493a1e3ce/services/keplr.ts#L50-L62 */
  readonly connect: (walletChange?: boolean | 'focus') => Promise<void>

  /** @see https://github.com/CosmosContracts/cascadiad-tools/blob/41c256f71d2b8b55fade12fae3b8c6a493a1e3ce/services/keplr.ts#L45-L48 */
  readonly disconnect: () => void | Promise<void>

  readonly getClient: () => SigningKeplrCosmWasmClient
  readonly getSigner: () => OfflineSigner

  /** @see https://github.com/CosmosContracts/cascadiad-tools/blob/41c256f71d2b8b55fade12fae3b8c6a493a1e3ce/contexts/wallet.tsx#L63 */
  readonly init: (signer?: OfflineSigner) => void

  /** https://github.com/CosmosContracts/cascadiad-tools/blob/41c256f71d2b8b55fade12fae3b8c6a493a1e3ce/contexts/wallet.tsx#L75-L89 */
  readonly refreshBalance: (address?: string, balance?: Coin[]) => Promise<void>

  /** @see https://github.com/CosmosContracts/cascadiad-tools/blob/41c256f71d2b8b55fade12fae3b8c6a493a1e3ce/contexts/wallet.tsx#L65 */
  readonly setNetwork: (network: string) => void

  /** @see https://github.com/CosmosContracts/cascadiad-tools/blob/41c256f71d2b8b55fade12fae3b8c6a493a1e3ce/contexts/wallet.tsx#L91-L93 */
  readonly updateSigner: (singer: OfflineSigner) => void

  readonly setQueryClient: () => void
}

/**
 * Compatibility export for references still using `WalletContextType`
 *
 * @deprecated replace with {@link KeplrWalletStore}
 */
export type WalletContextType = KeplrWalletStore

/**
 * Keplr wallet store default values as a separate variable for reusability
 */
const defaultStates = {
  accountNumber: 0,
  address: '',
  balance: [],
  client: undefined,
  config: getConfig(NETWORK),
  initialized: false,
  initializing: true,
  name: '',
  network: NETWORK,
  signer: undefined,
}

/**
 * Entrypoint for keplr wallet store using {@link defaultStates}
 */
export const useWalletStore = create(
  subscribeWithSelector<KeplrWalletStore>((set, get) => ({
    ...defaultStates,
    clear: () => set({ ...defaultStates }),
    connect: async (walletChange = false) => {
      try {
        if (walletChange !== 'focus') set({ initializing: true })
        const { config, init } = get()
        const signer = await loadKeplrWallet(config)
        init(signer)
        if (walletChange) set({ initializing: false })
      } catch (err: any) {
        toast.error(err?.message)
        set({ initializing: false })
      }
    },
    disconnect: () => {
      window.localStorage.clear()
      get().clear()
      set({ initializing: false })
    },
    getClient: () => get().client!,
    getSigner: () => get().signer!,
    init: (signer) => set({ signer }),
    refreshBalance: async (address = get().address, balance = get().balance) => {
      const { client, config } = get()
      if (!client) return
      balance.length = 0
      const coin = await fetchBalances(config.restUrl, address)
      set({ balance })
    },
    setNetwork: (network) => set({ network }),
    updateSigner: (signer) => set({ signer }),
    setQueryClient: async () => {
      try {
        const client = await createQueryClient()
        set({ client })
      } catch (err: any) {
        toast.error(err?.message)
        set({ initializing: false })
      }
    },
  })),
)

/**
 * Proxied keplr wallet store which only rerenders on called state values.
 *
 * Recommended if only consuming state; to set states, use {@link useWalletStore.setState}.
 *
 * @example
 *
 * ```ts
 * // this will rerender if any state values has changed
 * const { name } = useWalletStore()
 *
 * // this will rerender if only `name` has changed
 * const { name } = useWallet()
 * ```
 */
export const useWallet = createTrackedSelector<KeplrWalletStore>(useWalletStore)

/**
 * Keplr wallet store provider to easily mount {@link WalletSubscription}
 * to listen/subscribe various state changes.
 *
 */
export const WalletProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <WalletSubscription />
    </>
  )
}

/**
 * Keplr wallet subscriptions (side effects)
 */
const WalletSubscription = () => {
  useEffect(() => {
    const walletAddress = window.localStorage.getItem('wallet_address')
    if (walletAddress) {
      void useWalletStore.getState().connect()
    } else {
      useWalletStore.setState({ initializing: false })
      useWalletStore.getState().setQueryClient()
    }

    const listenChange = () => {
      void useWalletStore.getState().connect(true)
    }
    const listenFocus = () => {
      if (walletAddress) void useWalletStore.getState().connect('focus')
    }

    window.addEventListener('keplr_keystorechange', listenChange)
    window.addEventListener('focus', listenFocus)

    return () => {
      window.removeEventListener('keplr_keystorechange', listenChange)
      window.removeEventListener('focus', listenFocus)
    }
  }, [])

  /**
   * Watch signer changes to initialize client state.
   *
   * @see https://github.com/CosmosContracts/cascadiad-tools/blob/41c256f71d2b8b55fade12fae3b8c6a493a1e3ce/contexts/wallet.tsx#L95-L105
   */
  useEffect(() => {
    return useWalletStore.subscribe(
      (x) => x.signer,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (signer) => {
        try {
          if (!signer) {
            useWalletStore.setState({
              client: await createQueryClient(),
            })
          } else {
            useWalletStore.setState({
              client: await createClient({ signer }),
            })
          }
        } catch (error) {
          console.log(error)
        }
      },
    )
  }, [])

  useEffect(() => {
    return useWalletStore.subscribe(
      (x) => x.client,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (client) => {
        const { config, refreshBalance, signer } = useWalletStore.getState()
        if (!signer || !client) return
        if (!window.keplr) {
          throw new Error('window.keplr not found')
        }
        const balance: Coin[] = []
        const address = (await signer.getAccounts())[0].address
        // eslint-disable-next-line no-console
        console.log('url:-====', config.restUrl)
        const account = await fetchAccount(config.restUrl, address)
        const key = await window.keplr.getKey(config.chainId)
        await refreshBalance(address, balance)
        window.localStorage.setItem('wallet_address', address)
        useWalletStore.setState({
          accountNumber: Number(account.base_account.account_number) || 0,
          address,
          balance,
          initialized: true,
          initializing: false,
          name: key.name || '',
        })
      },
    )
  }, [])

  return null
}

const createClient = async ({ signer }: { signer: OfflineSigner }) => {
  const { config } = useWalletStore.getState()
  const { registry, aminoTypes } = getSigningClientOptions()
  const wasmClient = await SigningCosmWasmClient.connectWithSigner(config.rpcUrl, signer, {
    gasPrice: {
      amount: Decimal.fromUserInput('0.0025', 100),
      denom: config.feeToken,
    },
    registry,
    aminoTypes,
  })
  const offlineSigner = signer as OfflineDirectSigner
  return new SigningKeplrCosmWasmClient(wasmClient, offlineSigner)
}

const createQueryClient = async () => {
  const { config } = useWalletStore.getState()
  const { registry, aminoTypes } = getSigningClientOptions()
  const { keplr } = window
  const signer = keplr.getOfflineSigner(config.chainId)
  const wasmClient = await SigningCosmWasmClient.connectWithSigner(config.rpcUrl, signer, {
    gasPrice: {
      amount: Decimal.fromUserInput('200000', 0),
      denom: config.feeToken,
    },

    registry,
    aminoTypes,
  })
  return new SigningKeplrCosmWasmClient(wasmClient, signer)
}
export const getSigningClientOptions = () => {
  const registry = new Registry([...defaultRegistryTypes, ...cosmwasmProtoRegistry, ...ibcProtoRegistry])
  const aminoTypes = new AminoTypes({
    ...cosmwasmAminoConverters,
    ...ibcAminoConverters,
  })

  return {
    registry,
    aminoTypes,
  }
}

const loadKeplrWallet = async (config: AppConfig) => {
  if (!window.getOfflineSigner || !window.keplr || !window.getOfflineSignerAuto) {
    throw new Error('Keplr extension is not available')
  }

  await window.keplr.experimentalSuggestChain(keplrConfig(config))
  await window.keplr.enable(config.chainId)
  const signer = await window.getOfflineSignerAuto(config.chainId)

  Object.assign(signer, {
    signAmino: (signer as any).signAmino ?? (signer as any).sign,
  })

  return signer
}
