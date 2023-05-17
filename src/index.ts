import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { MsgStoreCodeEncodeObject, SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice, StdFee } from "@cosmjs/stargate";
import SigningCosmWasmEthermintClient from "./SigningKeplrEthermintClient";

import fs from "fs";
import pako from "pako";

import { Slip10RawIndex } from "@cosmjs/crypto";
import {
  MsgClearAdmin,
  MsgExecuteContract,
  MsgInstantiateContract,
  MsgMigrateContract,
  MsgStoreCode,
  MsgUpdateAdmin,
} from "cosmjs-types/cosmwasm/wasm/v1/tx";

// export const getSigningClientOptions = () => {
//   const registry = new Registry([...defaultRegistryTypes, ...ethermintProtoRegistry]);
//   const aminoTypes = new AminoTypes({
//     ...ethermintAminoConverters,
//   });

//   return {
//     registry,
//     aminoTypes,
//   };
// };

function makeEthPath(account: number): readonly Slip10RawIndex[] {
  return [
    Slip10RawIndex.hardened(44),
    Slip10RawIndex.hardened(60),
    Slip10RawIndex.hardened(account),
    Slip10RawIndex.normal(0),
    Slip10RawIndex.normal(0),
  ];
}

const deploy = async () => {
  // Chain ID and RPC URL
  const chainId = "cascadia_6102-1";
  const prefix = "cascadia";
  const rpcEndpoint = "http://localhost:26657";
  // Load the wallet key

  const hdPath = makeEthPath(0);
  const mnemonic =
    "actress letter whip youth flip sort announce chief traffic side destroy seek parade warrior awake scan panther nominee harsh spawn differ enroll glue become";
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { hdPaths: [hdPath], prefix: prefix });
  const [firstAccount] = await wallet.getAccounts();
  console.log(firstAccount.address, firstAccount.algo);

  // Initialize the CosmJS client
  const cosmwasmClient = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet);
  const client = new SigningCosmWasmEthermintClient(cosmwasmClient, wallet);

  // Read the compiled contract
  const wasmBuffer = fs.readFileSync("./cw20_base.wasm");
  const wasm = new Uint8Array(wasmBuffer);
  const compressed = pako.gzip(wasm, { level: 9 });

  // Upload the contract
  //const gasPrice = GasPrice.fromString("7aCC");
  const fee: StdFee = {
    amount: [{ denom: "aCC", amount: "14000000" }],
    gas: "2000000",
  };

  const storeCodeMsg: MsgStoreCodeEncodeObject = {
    typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
    value: MsgStoreCode.fromPartial({
      sender: firstAccount.address,
      wasmByteCode: compressed,
    }),
  };

  const uploadTx = await client.signWithEthermint(firstAccount, [storeCodeMsg], chainId, 0, 13, fee, "test");

  console.log(uploadTx);
  try {
    const tx = await client.broadCastTx(uploadTx);
    console.log(tx);
  } catch (error) {
    console.log("error", error);
  }

  //const uploadReceipt = await client.upload(firstAccount.address, wasm, fee, "test");

  //   // Get the code ID from the upload receipt
  //   const { codeId } = uploadReceipt;

  //   // Define the init message
  //   const initMsg = {
  //     /* your init message */
  //   };

  //   // Instantiate the contract
  //   const instantiateReceipt = await client.instantiate(firstAccount.address, codeId, initMsg, "Contract Name", "auto", {
  //     memo: "Instantiate Contract",
  //   });

  //   // Get the contract address from the instantiate receipt
  //   const { contractAddress } = instantiateReceipt;
  //   console.log("contract address", contractAddress);
};

deploy();
