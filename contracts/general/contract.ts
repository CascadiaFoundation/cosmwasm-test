import type { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { toBase64, toUtf8 } from '@cosmjs/encoding'
import type { Coin } from '@cosmjs/proto-signing'
// import { isDeliverTxFailure } from '@cosmjs/stargate'
// import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
// import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { getExecuteFee } from 'utils/fees'
import SigningKeplrCosmWasmClient from 'utils/signingKeplrCosmWasmClient'

const jsonToBinary = (json: Record<string, unknown>): string => {
  return toBase64(toUtf8(JSON.stringify(json)))
}

type Expiration = { at_height: number } | { at_time: string } | { never: object }


export interface InstantiateResponse {
  readonly contractAddress: string
  readonly transactionHash: string
}

export interface WasmBaseInstance {
  readonly contractAddress: string
  // Execute
  execute: (contract: string, msg: Record<string, unknown>) => Promise<string>
  
}



export interface RevokeAllMessage {
  sender: string
  contract: string
  msg: {
    revoke_all: {
      operator: string
    }
  }
  funds: Coin[]
}


export interface WasmBaseContract {
  instantiate: (
    senderAddress: string,
    codeId: number,
    initMsg: Record<string, unknown>,
    label: string,
    admin?: string,
  ) => Promise<InstantiateResponse>
  execute: (
    contractAddress: string,
    initMsg: Record<string, unknown>,
  ) => Promise<string>

}

export const WasmBase = (evmClient: SigningKeplrCosmWasmClient, txSigner: string): WasmBaseContract => {
  const fee = getExecuteFee()


  const instantiate = async (
    senderAddress: string,
    codeId: number,
    initMsg: Record<string, unknown>,
    label: string,
    admin?: string,
  ): Promise<InstantiateResponse> => {
    const result = await evmClient.instantiate(txSigner, codeId, initMsg, label, 'auto', {
      memo: '',
      admin,
    })

    return {
      contractAddress: result.contractAddress,
      transactionHash: result.transactionHash,
    }
  }

  const execute = async (
    contractAddress: string,
    initMsg: Record<string, unknown>,
  ): Promise<string> => {
    const result = await evmClient.execute(txSigner,contractAddress, initMsg)

    return result.transactionHash
  }





  return { instantiate, execute }
}
