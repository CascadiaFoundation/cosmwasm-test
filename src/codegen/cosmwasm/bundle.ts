import * as _95 from "./wasm/v1/authz";
import * as _96 from "./wasm/v1/genesis";
import * as _97 from "./wasm/v1/ibc";
import * as _98 from "./wasm/v1/proposal";
import * as _99 from "./wasm/v1/query";
import * as _100 from "./wasm/v1/tx";
import * as _101 from "./wasm/v1/types";
import * as _220 from "./wasm/v1/tx.amino";
import * as _221 from "./wasm/v1/tx.registry";
import * as _222 from "./wasm/v1/query.rpc.Query";
import * as _223 from "./wasm/v1/tx.rpc.msg";
import * as _251 from "./rpc.query";
import * as _252 from "./rpc.tx";
export namespace cosmwasm {
  export namespace wasm {
    export const v1 = {
      ..._95,
      ..._96,
      ..._97,
      ..._98,
      ..._99,
      ..._100,
      ..._101,
      ..._220,
      ..._221,
      ..._222,
      ..._223
    };
  }
  export const ClientFactory = {
    ..._251,
    ..._252
  };
}