import { useWallet } from 'contexts/wallet'
import { useCallback, useEffect, useState } from 'react'

import type { WasmBaseContract, WasmBaseInstance } from './contract'
import { WasmBase as initContract } from './contract'

interface InstantiateResponse {
  readonly contractAddress: string
  readonly transactionHash: string
}

export interface UseWasmBaseContractProps {
  instantiate: (
    codeId: number,
    initMsg: Record<string, unknown>,
    label: string,
    admin?: string,
  ) => Promise<InstantiateResponse>
  execute: (contractAddress:string, msg:Record<string, unknown> ) => Promise<string>
}

export function useWasmBaseContract(): UseWasmBaseContractProps {
  const wallet = useWallet()

  const [address, setAddress] = useState<string>('')
  const [WasmBase, setWasmBase] = useState<WasmBaseContract>()

  useEffect(() => {
    setAddress(localStorage.getItem('contract_address') || '')
  }, [])

  useEffect(() => {
    const wasmBaseContract = initContract(wallet.getClient(), wallet.address)
    setWasmBase(wasmBaseContract)
  }, [wallet])


  const instantiate = useCallback(
    (codeId: number, initMsg: Record<string, unknown>, label: string, admin?: string): Promise<InstantiateResponse> => {
      return new Promise((resolve, reject) => {
        if (!WasmBase) {
          reject(new Error('Contract is not initialized.'))
          return
        }
        WasmBase.instantiate(wallet.address, codeId, initMsg, label, admin).then(resolve).catch(reject)
      })
    },
    [WasmBase, wallet],
  )




  const execute = useCallback(
    (contractAddress:string, msg: Record<string, unknown>): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!WasmBase) {
          reject(new Error('Contract is not initialized.'))
          return
        }
        WasmBase.execute(contractAddress,msg).then(resolve).catch(reject)
      })
    },
    [WasmBase, wallet],
  )


  return {
    instantiate,
    execute,
  }
}
