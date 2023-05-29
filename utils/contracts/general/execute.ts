import type { WasmBaseInstance } from 'contracts/general'
import { useWasmBaseContract } from 'contracts/general'

export type ExecuteType = typeof EXECUTE_TYPES[number]

export const EXECUTE_TYPES = [
  'execute',
] as const

export interface ExecuteListItem {
  id: ExecuteType
  name: string
  description?: string
}

export const EXECUTE_LIST: ExecuteListItem[] = [
  {
    id: 'execute',
    name: 'Execute message',
    description: `Execute cosmwas contract message`,
  },
]

export interface DispatchExecuteProps {
  type: ExecuteType
  [k: string]: unknown
}

type Select<T extends ExecuteType> = T

/** @see {@link CW1SubkeysInstance} */
export type DispatchExecuteArgs = {
  contract?: string
  messages?: WasmBaseInstance
  txSigner: string
} & (
  | { type: undefined }
  | { type: Select<'execute'>; contractAddress: string; msg: Record<string, unknown>}
)

export const dispatchExecute = async (args: DispatchExecuteArgs) => {
  const { messages } = args
  console.log("message", messages)
  if (!messages) {
    throw new Error('cannot dispatch execute, messages is not defined')
  }
  switch (args.type) {
    case 'execute': {
      return messages.execute(args.contractAddress, args.msg)
    }
    default: {
      throw new Error('unknown execute type')
    }
  }
}

export const previewExecutePayload = (args: DispatchExecuteArgs) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  switch (args.type) {
    case 'execute': {
      return args.msg
    }
    default: {
      return {}
    }
  }
}

export const isEitherType = <T extends ExecuteType>(type: unknown, arr: T[]): type is T => {
  return arr.some((val) => type === val)
}
