import * as _125 from "./applications/transfer/v1/genesis";
import * as _126 from "./applications/transfer/v1/query";
import * as _127 from "./applications/transfer/v1/transfer";
import * as _128 from "./applications/transfer/v1/tx";
import * as _129 from "./applications/transfer/v2/packet";
import * as _130 from "./core/channel/v1/channel";
import * as _131 from "./core/channel/v1/genesis";
import * as _132 from "./core/channel/v1/query";
import * as _133 from "./core/channel/v1/tx";
import * as _134 from "./core/client/v1/client";
import * as _135 from "./core/client/v1/genesis";
import * as _136 from "./core/client/v1/query";
import * as _137 from "./core/client/v1/tx";
import * as _138 from "./core/commitment/v1/commitment";
import * as _139 from "./core/connection/v1/connection";
import * as _140 from "./core/connection/v1/genesis";
import * as _141 from "./core/connection/v1/query";
import * as _142 from "./core/connection/v1/tx";
import * as _143 from "./core/port/v1/query";
import * as _144 from "./core/types/v1/genesis";
import * as _145 from "./lightclients/localhost/v1/localhost";
import * as _146 from "./lightclients/solomachine/v1/solomachine";
import * as _147 from "./lightclients/solomachine/v2/solomachine";
import * as _148 from "./lightclients/tendermint/v1/tendermint";
import * as _232 from "./applications/transfer/v1/tx.amino";
import * as _233 from "./core/channel/v1/tx.amino";
import * as _234 from "./core/client/v1/tx.amino";
import * as _235 from "./core/connection/v1/tx.amino";
import * as _236 from "./applications/transfer/v1/tx.registry";
import * as _237 from "./core/channel/v1/tx.registry";
import * as _238 from "./core/client/v1/tx.registry";
import * as _239 from "./core/connection/v1/tx.registry";
import * as _240 from "./applications/transfer/v1/query.rpc.Query";
import * as _241 from "./core/channel/v1/query.rpc.Query";
import * as _242 from "./core/client/v1/query.rpc.Query";
import * as _243 from "./core/connection/v1/query.rpc.Query";
import * as _244 from "./core/port/v1/query.rpc.Query";
import * as _245 from "./applications/transfer/v1/tx.rpc.msg";
import * as _246 from "./core/channel/v1/tx.rpc.msg";
import * as _247 from "./core/client/v1/tx.rpc.msg";
import * as _248 from "./core/connection/v1/tx.rpc.msg";
import * as _255 from "./rpc.query";
import * as _256 from "./rpc.tx";
export namespace ibc {
  export namespace applications {
    export namespace transfer {
      export const v1 = {
        ..._125,
        ..._126,
        ..._127,
        ..._128,
        ..._232,
        ..._236,
        ..._240,
        ..._245
      };
      export const v2 = {
        ..._129
      };
    }
  }
  export namespace core {
    export namespace channel {
      export const v1 = {
        ..._130,
        ..._131,
        ..._132,
        ..._133,
        ..._233,
        ..._237,
        ..._241,
        ..._246
      };
    }
    export namespace client {
      export const v1 = {
        ..._134,
        ..._135,
        ..._136,
        ..._137,
        ..._234,
        ..._238,
        ..._242,
        ..._247
      };
    }
    export namespace commitment {
      export const v1 = {
        ..._138
      };
    }
    export namespace connection {
      export const v1 = {
        ..._139,
        ..._140,
        ..._141,
        ..._142,
        ..._235,
        ..._239,
        ..._243,
        ..._248
      };
    }
    export namespace port {
      export const v1 = {
        ..._143,
        ..._244
      };
    }
    export namespace types {
      export const v1 = {
        ..._144
      };
    }
  }
  export namespace lightclients {
    export namespace localhost {
      export const v1 = {
        ..._145
      };
    }
    export namespace solomachine {
      export const v1 = {
        ..._146
      };
      export const v2 = {
        ..._147
      };
    }
    export namespace tendermint {
      export const v1 = {
        ..._148
      };
    }
  }
  export const ClientFactory = {
    ..._255,
    ..._256
  };
}