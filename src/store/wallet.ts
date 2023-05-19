import {GasPrice } from '@cosmjs/stargate';
import { Decimal } from "@cosmjs/math";
import {  SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import type { StateCreator } from 'zustand';
import { create } from 'zustand';
import type { PersistOptions } from 'zustand/middleware';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { BriefChainInfo } from '@/shared/types/chain';
import { getSideChainInfo } from '@/shared/types/chain';
//import { SideSigningStargateClient } from '@/utils/side_stargateclient';
import { defaultRegistryTypes, AminoTypes } from "@cosmjs/stargate";
import SigningKeplrCosmWasmClient from "@/utils/SigningKeplrCosmWasmClient"

import PromisePool from '@supercharge/promise-pool';
import { AppConfig } from '@/utils/AppConfig';
import { Registry } from "@cosmjs/proto-signing";
import {cosmwasmProtoRegistry,cosmwasmAminoConverters} from '@/codegen/cosmwasm/client'
import {ibcProtoRegistry,ibcAminoConverters} from '@/codegen/ibc/client'

import chargeCoins from '@/http/requests/post/chargeCoins';

import fetchBalances from '@/http/requests/get/fetchBalance';



export const getSigningClientOptions =()=>{
  const registry = new Registry([...defaultRegistryTypes, ... cosmwasmProtoRegistry, ...ibcProtoRegistry]);
  const aminoTypes = new AminoTypes({
    ...cosmwasmAminoConverters,...ibcAminoConverters
  });

  return {
    registry,
    aminoTypes
  }
}
export interface Wallet {
  
  address: string;
  chainInfo: BriefChainInfo;
}
interface WalletState {
  loading: boolean,
  isConnected: boolean,
  wallets: Wallet[];
  setLoading:(isLoad:boolean)=>void
  connectWallet: () => Promise<void>;
  suggestChain:(chain:BriefChainInfo)=>Promise<void>
  getClient: (chain:BriefChainInfo) => Promise<SigningKeplrCosmWasmClient|undefined>;
  disconnect: () => void;
  charge:()=>Promise<void>;
  getBalance:()=> Promise<any>;
}

type WalletPersist = (
  config: StateCreator<WalletState>,
  options: PersistOptions<WalletState>
) => StateCreator<WalletState>;

const useWalletStore = create<WalletState>(
  (persist as WalletPersist)(
    (set, get) => ({
      loading: false,
      isConnected: false,
      wallets: [],
      setLoading:((isLoad:boolean)=>{
        set((state) => ({
          ...state,
          loading: isLoad,
        }));
      }),
      suggestChain: async(chain:BriefChainInfo)=> {
        const { keplr } = window;
        if (!keplr) {
          alert('You need to install Keplr');
          throw new Error('You need to install Keplr');
        }
        const chainInfo = getSideChainInfo(chain);
        await keplr.experimentalSuggestChain(chainInfo);
      },
      connectWallet: async () => {
        const { setLoading, suggestChain } = get();
        setLoading(true)
      
        const { keplr } = window;
        if (!keplr) {
          alert('You need to install Keplr');
          throw new Error('You need to install Keplr');
        }
      
        const newWallets: Wallet[] = [];
      
        for (const chain of AppConfig.chains) {
          try {
            await suggestChain(chain)
            // Poll until the chain is approved and the signer is available
            const offlineSigner = await keplr.getOfflineSigner(chain.chainID);
            const newCreator = (await offlineSigner.getAccounts())[0].address;
            const newWallet: Wallet = {
              address: newCreator,              
              chainInfo: chain,
            };
            newWallets.push(newWallet);
          } catch (error) {
            console.log('Connection Error', error);
          }
        }
      
        if(newWallets.length === AppConfig.chains.length) {
          set((state) => ({
            ...state,
            isConnected: true,
            wallets: newWallets,
          }));
        } else {
          
          console.log('Not all chains could be registered.')
        }
      
        setLoading(false)
      },

      
      
      getClient: async (chain:BriefChainInfo) => {
        try {
          const { setLoading } = get();
        
          setLoading(true)
          const { keplr } = window;
          if (!keplr) {
            alert('You need to install Keplr');
            throw new Error('You need to install Keplr');
          }
          const chainInfo = getSideChainInfo(chain);
          await keplr.experimentalSuggestChain(chainInfo);
          const offlineSigner = await keplr.getOfflineSigner(chainInfo.chainId);
  
          const {aminoTypes, registry} = getSigningClientOptions()
          const newSigningClient = await SigningCosmWasmClient.connectWithSigner(
            chain.rpcUrl,
            offlineSigner,
            {
              gasPrice: {denom: chain.denom, amount: Decimal.fromUserInput("200000000000000000000",0)},
              registry,
              aminoTypes,
            }
          )

          console.log("log:",newSigningClient)
          const newClient = new SigningKeplrCosmWasmClient(newSigningClient, offlineSigner)
          setLoading(false)
          return newClient
        } catch (error) {
          return undefined
        }
      },
      disconnect: () => {
        set((state) => ({ ...state, isConnected: false,wallets: [] }));
      },

      charge: async() => {
          const {wallets, setLoading, connectWallet} = get()
          await connectWallet()
          setLoading(true)
          const res = await PromisePool.withConcurrency(2)
          .for(wallets)
          .process(async (chain) => {
            const url = new URL(chain.chainInfo.rpcUrl);
            await chargeCoins(url.hostname, chain.chainInfo.denom, chain.address)
          })
          setLoading(false)
          console.log(res.errors)
      },
      getBalance: async() => {
        const {wallets, setLoading, connectWallet} = get()
        await connectWallet()
        setLoading(true)
        const res = await PromisePool.withConcurrency(2)
        .for(wallets)
        .process(async (chain) => {
          const url = new URL(chain.chainInfo.rpcUrl);
          const balances = await fetchBalances(url.hostname, chain.address)
          return {address: chain.address, balances: balances};
        })
        setLoading(false)
        return res.results
      }


    }),
    { name: 'wallet-store', storage: createJSONStorage(() => sessionStorage) }
  )
);

export default useWalletStore;
