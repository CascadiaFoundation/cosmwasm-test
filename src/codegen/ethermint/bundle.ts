import * as _102 from "./crypto/v1/ethsecp256k1/keys";
import * as _103 from "./evm/v1/events";
import * as _104 from "./evm/v1/evm";
import * as _105 from "./evm/v1/genesis";
import * as _106 from "./evm/v1/query";
import * as _107 from "./evm/v1/tx";
import * as _108 from "./feemarket/v1/events";
import * as _109 from "./feemarket/v1/feemarket";
import * as _110 from "./feemarket/v1/genesis";
import * as _111 from "./feemarket/v1/query";
import * as _112 from "./feemarket/v1/tx";
import * as _113 from "./types/v1/account";
import * as _114 from "./types/v1/dynamic_fee";
import * as _115 from "./types/v1/indexer";
import * as _116 from "./types/v1/web3";
import * as _224 from "./evm/v1/tx.amino";
import * as _225 from "./feemarket/v1/tx.amino";
import * as _226 from "./evm/v1/tx.registry";
import * as _227 from "./feemarket/v1/tx.registry";
import * as _228 from "./evm/v1/query.rpc.Query";
import * as _229 from "./feemarket/v1/query.rpc.Query";
import * as _230 from "./evm/v1/tx.rpc.msg";
import * as _231 from "./feemarket/v1/tx.rpc.msg";
import * as _253 from "./rpc.query";
import * as _254 from "./rpc.tx";
export namespace ethermint {
  export namespace crypto {
    export namespace v1 {
      export const ethsecp256k1 = {
        ..._102
      };
    }
  }
  export namespace evm {
    export const v1 = {
      ..._103,
      ..._104,
      ..._105,
      ..._106,
      ..._107,
      ..._224,
      ..._226,
      ..._228,
      ..._230
    };
  }
  export namespace feemarket {
    export const v1 = {
      ..._108,
      ..._109,
      ..._110,
      ..._111,
      ..._112,
      ..._225,
      ..._227,
      ..._229,
      ..._231
    };
  }
  export namespace types {
    export const v1 = {
      ..._113,
      ..._114,
      ..._115,
      ..._116
    };
  }
  export const ClientFactory = {
    ..._253,
    ..._254
  };
}