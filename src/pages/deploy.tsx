import WalletLoader from "@/components/WalletLoader";
import useWalletStore from "@/store/wallet";
import { StdFee } from "@cosmjs/stargate";
import pako from "pako";
import { MsgStoreCodeEncodeObject } from "@cosmjs/cosmwasm-stargate";
import {
  MsgStoreCode,
} from "cosmjs-types/cosmwasm/wasm/v1/tx";
import fetchAccount from "@/http/requests/get/fetchAccount";
import { ChangeEvent, useEffect, useState } from "react";


const Deploy = () => {
  const { wallets, setLoading, loading, getClient } = useWalletStore();

  const [selectedFile, setSelectedFile] = useState<File>();
  const [wasmFileContent, setWasmFileContent] = useState<Buffer>();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileRead = async () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWasmFileContent(reader.result as Buffer);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  useEffect(()=>{
    handleFileRead()
  },[selectedFile])

  
  const wasmDeploy = async() => {
    setLoading(true)
    try {
      const wallet = wallets[0]!
    // Read the compiled contract
    if(wasmFileContent === undefined) {
      alert("Please select file")
      return 
    }
    const wasm = new Uint8Array(wasmFileContent);
    const compressed = pako.gzip(wasm, { level: 9 });

    const fee: StdFee = {
      amount: [{ denom: "aCC", amount: "1400000000000000000" }],
      gas: "10000000",
    };
  
    const storeCodeMsg: MsgStoreCodeEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
      value: MsgStoreCode.fromPartial({
        sender: wallet.address,
        wasmByteCode: compressed,
      }),
    };

    const client = await getClient(wallet.chainInfo)
    if(client === undefined) {
      console.log("Client doesn't defined")
      return
    }
    
    const account = await fetchAccount(wallet.chainInfo.restUrl, wallet.address)

    const uploadTx = await client.signWithEthermint(
      wallet.address,
      [storeCodeMsg],
      wallet.chainInfo.chainID,
      +account.base_account.sequence,
      +account.base_account.account_number,
      fee,
      ""
    );
    console.log(uploadTx)
    const tx = await client.broadCastTx(uploadTx!);
    try {
      console.log(tx);
    } catch (error) {
      console.log("error", error);
    }
    } catch (error) {
      
    }

    
    setLoading(false)
  }

  return (
    <WalletLoader loading={loading}>
      <div>
        <input type="file" className="mb-4" onChange={handleFileChange} />
        <div className="grid gap-4">
          <button className="btn btn-primary" onClick={wasmDeploy}>Deploy</button>
        </div>
      </div>
    </WalletLoader>
  );
};

export default Deploy;
