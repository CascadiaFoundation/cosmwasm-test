import { MsgStoreCodeEncodeObject,MsgInstantiateContractEncodeObject, SigningCosmWasmClient, UploadResult, InstantiateOptions, InstantiateResult } from '@cosmjs/cosmwasm-stargate';
import { Int53,Uint53 } from '@cosmjs/math';
import {
  Coin,
  EncodeObject,
  makeAuthInfoBytes,
  makeSignDoc,
} from '@cosmjs/proto-signing';
import { DeliverTxResponse, StdFee, isDeliverTxFailure, logs } from '@cosmjs/stargate';
import { MsgExecuteContract, MsgInstantiateContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { OfflineDirectSigner, StdSignature } from '@keplr-wallet/types';
import pako from "pako"
import { MsgStoreCode } from 'codegen/cosmwasm/wasm/v1/tx';
import fetchAccount from 'http/get/fetchAccount';
import { getConfig } from 'config';
import { SignMode } from '@terra-money/terra.js';
import { fromBase64, toHex, toUtf8,fromAscii, fromHex, toAscii, } from "@cosmjs/encoding";
import { sha256 } from "@cosmjs/crypto";
import Long from 'long';
export default class SigningKeplrCosmWasmClient {
  client: SigningCosmWasmClient;
  private offlineSigner: OfflineDirectSigner;

  constructor(
    client: SigningCosmWasmClient,
    offlineSigner: OfflineDirectSigner
  ) {
    this.client = client;
    this.offlineSigner = offlineSigner;
  }
  async signWithEthermint(
    signerAddress:string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string
  ): Promise<{signedBytes:Uint8Array, rawTx: {
    bodyBytes: Uint8Array;
    authInfoBytes: Uint8Array;
    signatures: Uint8Array[];
}   } | undefined> {
    try {

      const account = await this.offlineSigner.getAccounts()
      const acc = account.find(x => x.address === signerAddress)
      console.log(signerAddress)
      const config = getConfig('test')
      const accountInfo = await fetchAccount(config.restUrl,signerAddress)

      // Custom typeUrl for EVMOS
      const pubkey = Any.fromPartial({
        typeUrl: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
        value: PubKey.encode({
          key: acc!.pubkey,
        }).finish(),
      });

      console.log('PubKey:', pubkey);

      const txBodyEncodeObject = {
        typeUrl: '/cosmos.tx.v1beta1.TxBody',
        value: {
          messages,
          memo,
        },
      };

      const txBodyBytes = this.client.registry.encode(txBodyEncodeObject);
      const gasLimit = Int53.fromString(fee.gas).toNumber();
      const authInfoBytes = makeAuthInfoBytes(
        [{ pubkey: pubkey, sequence: +accountInfo.base_account.sequence }],
        fee.amount,
        gasLimit
      );
      const signDoc = makeSignDoc(
        txBodyBytes,
        authInfoBytes,
        config.chainId,
        +accountInfo.base_account.account_number
      );
      
      const { signature, signed } = await this.offlineSigner.signDirect(
        signerAddress,
        signDoc
      );
      const rawTx = {
        bodyBytes: signed.bodyBytes,
        authInfoBytes: signed.authInfoBytes,
        signatures: [fromBase64(signature.signature)],
      }
      // returns txBytes for broadcast
      return {signedBytes: await Promise.resolve(
        TxRaw.encode(rawTx).finish()
      ),rawTx: rawTx};
    } catch (error) {
      console.log('error', error);
      return undefined;
    }
  }
  async broadcastTx(tx: Uint8Array): Promise<DeliverTxResponse|undefined> {
    try {
      const txData = await this.client.broadcastTx(tx);
      return txData;
    } catch (error) {
      console.log(error);
      return ;
    }
  }

  async signAndBroadcast( signerAddress:string,
    messages: readonly EncodeObject[],
    fee: StdFee | "auto" ,
    memo: string|undefined): Promise<DeliverTxResponse|undefined> {

      let autoFee: StdFee
      if(fee === 'auto') {
         autoFee = {
          amount: [{ denom: "aCC", amount: "1400000000000000000" }],
          gas: "1000000000",
        };
      }else{
        autoFee = fee
      }
    
    const signed = await this.signWithEthermint(signerAddress,messages, autoFee, memo ?? '')
    if(!signed?.signedBytes) {
      return undefined
    }
    const result = await this.broadcastTx(signed!.signedBytes)
    return result
  }

  async upload(senderAddress:string,  wasmCode: Uint8Array, fee: StdFee|'auto'):Promise<UploadResult|undefined> {
    
      const wasm = new Uint8Array(wasmCode);
      const compressed = pako.gzip(wasm, { level: 9 });
      const config = getConfig('testnet')

      const storeCodeMsg: MsgStoreCodeEncodeObject = {
        typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
        value: MsgStoreCode.fromPartial({
          sender: senderAddress,
          wasmByteCode: compressed,
        }),
      };

      let autoFee: StdFee
      if(fee === 'auto') {
         autoFee = {
          amount: [{ denom: "aCC", amount: "1400000000000000000" }],
          gas: "1000000000",
        };
      }else{
        autoFee = fee
      }
      const signedTx = await this.signWithEthermint(
        senderAddress,
        [storeCodeMsg],
        autoFee,
        ""
      );
      const result = await this.broadcastTx(signedTx!.signedBytes);
      if(result === undefined) {
        return
      }
      console.log("result=====>", result)
      const parsedLogs = logs.parseRawLog(result.rawLog);
      const codeIdAttr = logs.findAttribute(parsedLogs, "store_code", "code_id");
      return {
        originalSize: wasmCode.length,
        originalChecksum: toHex(sha256(wasmCode)),
        compressedSize: compressed.length,
        compressedChecksum: toHex(sha256(compressed)),
        codeId: Number.parseInt(codeIdAttr.value, 10),
        logs: parsedLogs,
        height: result.height,
        transactionHash: result.transactionHash,
        gasWanted: result.gasWanted,
        gasUsed: result.gasUsed,
      };
  }


  async instantiateContract(
    sender:string,
    codeId: number,
    beneficiaryAddress: string,
    label: string,
    funds?: readonly Coin[],
  ): Promise<DeliverTxResponse|undefined> {
    const memo = "Create an escrow instance";
    const theMsg: MsgInstantiateContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
      value: MsgInstantiateContract.fromPartial({
        sender: sender,
        codeId: Long.fromNumber(codeId),
        label: label,
        msg: toAscii(
          JSON.stringify({
            verifier: sender,
            beneficiary: beneficiaryAddress,
          }),
        ),
        funds: funds ? [...funds] : [],
      }),
    };
    const fee: StdFee = {
      amount: [{ denom: "aCC", amount: "1400000000000000000" }],
      gas: "89000000",
    };
    return this.signAndBroadcast(sender, [theMsg], fee, memo);
  }


  public async instantiate(
    senderAddress: string,
    codeId: number,
    msg: Record<string, unknown>,
    label: string,
    fee: StdFee | "auto" ,
    options: InstantiateOptions = {},
  ): Promise<InstantiateResult> {

    const instantiateContractMsg: MsgInstantiateContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgInstantiateContract",
      value: MsgInstantiateContract.fromPartial({
        sender: senderAddress,
        codeId: Long.fromString(new Uint53(codeId).toString()),
        label: label,
        msg: toUtf8(JSON.stringify(msg)),
        funds: [...(options.funds || [])],
        admin: options.admin,
      }),
    };
    const result = await this.signAndBroadcast(senderAddress, [instantiateContractMsg], fee, options.memo);
    if(!result) {
      throw new Error("failed to transaction");
    }
    if (isDeliverTxFailure(result)) {
      throw new Error(this.createDeliverTxResponseErrorMessage(result));
    }
    const parsedLogs = logs.parseRawLog(result.rawLog);
    const contractAddressAttr = logs.findAttribute(parsedLogs, "instantiate", "_contract_address");
    return {
      contractAddress: contractAddressAttr.value,
      logs: parsedLogs,
      height: result.height,
      transactionHash: result.transactionHash,
      gasWanted: result.gasWanted,
      gasUsed: result.gasUsed,
    };
  }

  createDeliverTxResponseErrorMessage(result: DeliverTxResponse): string {
    return `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`;
  }
  
}
