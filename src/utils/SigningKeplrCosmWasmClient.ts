import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { fromBase64 } from '@cosmjs/encoding';
import { Int53 } from '@cosmjs/math';
import {
  EncodeObject,
  makeAuthInfoBytes,
  makeSignDoc,
} from '@cosmjs/proto-signing';
import { StdFee } from '@cosmjs/stargate';

import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { OfflineDirectSigner, StdSignature } from '@keplr-wallet/types';

import { AccountData } from '@cosmjs/amino';
import { IAccount } from '@/shared/types/account';
export default class SigningKeplrCosmWasmClient {
  private client: SigningCosmWasmClient;
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
    chainId: string,
    accountSequence: number,
    accountNumber: number,
    fee: StdFee,
    memo: string
  ): Promise<Uint8Array | undefined> {
    try {
      const account = await this.offlineSigner.getAccounts()
      const acc = account.find(x => x.address === signerAddress)
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
        [{ pubkey: pubkey, sequence: accountSequence }],
        fee.amount,
        gasLimit
      );
      const signDoc = makeSignDoc(
        txBodyBytes,
        authInfoBytes,
        chainId,
        accountNumber
      );
      const { signature, signed } = await this.offlineSigner.signDirect(
        signerAddress,
        signDoc
      );

      // returns txBytes for broadcast
      return Promise.resolve(
        TxRaw.encode({
          bodyBytes: signed.bodyBytes,
          authInfoBytes: signed.authInfoBytes,
          signatures: [fromBase64(signature.signature)],
        }).finish()
      );
    } catch (error) {
      console.log('error', error);
      return undefined;
    }
  }
  async broadCastTx(tx: Uint8Array): Promise<string> {
    try {
      const txData = await this.client.broadcastTx(tx);
      console.log(txData);
      return txData.transactionHash;
    } catch (error) {
      console.log(error);
      return '';
    }
  }
}
