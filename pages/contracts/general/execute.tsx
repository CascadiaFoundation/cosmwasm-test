import { Button } from 'components/Button'
import { ContractPageHeader } from 'components/ContractPageHeader'
import { FormControl } from 'components/FormControl'
import { AddressInput } from 'components/forms/FormInput'
import { useInputState } from 'components/forms/FormInput.hooks'
import { JsonTextArea } from 'components/forms/FormTextArea'
import { JsonPreview } from 'components/JsonPreview'
import { LinkTabs } from 'components/LinkTabs'
import { wasmLinkTabs } from 'components/LinkTabs.data'
import { TransactionHash } from 'components/TransactionHash'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FaArrowRight } from 'react-icons/fa'
import { useMutation } from 'react-query'
import type { DispatchExecuteArgs } from 'utils/contracts/general/execute'
import { dispatchExecute, isEitherType, previewExecutePayload } from 'utils/contracts/general/execute'
import { parseJson } from 'utils/json'
import { withMetadata } from 'utils/layout'
import { links } from 'utils/links'

const WasmBaseExecutePage: NextPage = () => {
  const { wasm: contract } = useContracts()
  const wallet = useWallet()
  const [lastTx, setLastTx] = useState('')

  const contractState = useInputState({
    id: 'contract-address',
    name: 'contract-address',
    title: 'Wasm Contract Address',
    subtitle: 'Address of the Wasm contract',
  })

  const messageState = useInputState({
    id: 'message',
    name: 'message',
    title: 'Message',
    subtitle: 'Message to execute on the contract',
    defaultValue: JSON.stringify({ key: 'value' }, null, 2),
  })


const payload: DispatchExecuteArgs = {
    contractAddress: contractState.value,
    msg: parseJson(messageState.value) || {},
    txSigner: wallet.address,
    type: 'execute'
  }

  const { data, isLoading, mutate } = useMutation(
    async (event: FormEvent): Promise<string | null> => {
      event.preventDefault()
      if (!contract) {
        throw new Error('Smart contract connection failed')
      }

      const msg = messageState.value
      return toast.promise(
        contract.execute(contractState.value, JSON.parse(messageState.value)),
        {
          loading: 'Executing contract...',
          error: 'Execute failed!',
          success: 'Execute success!',
        },
      )
    },
    {
      onError: (error) => {
        toast.error(String(error))
      },
    },
  )

  return (
    <section className="px-12 py-6 space-y-4">
      <NextSeo title="Execute Wasm Contract" />
      <ContractPageHeader
        description="You can run message which cosmwasm contract can treat."
        link={links['Docs CW721 Base']}
        title="Wasm Contract"
      />
      <LinkTabs activeIndex={2} data={wasmLinkTabs} />

      <form className="grid grid-cols-2 p-4 space-x-8" onSubmit={mutate}>
        <div className="space-y-8">
          <AddressInput {...contractState} />
          <JsonTextArea {...messageState} />
        </div>
        <div className="space-y-8">
          <div className="relative">
            <Button className="absolute top-0 right-0" isLoading={isLoading} type="submit">
              Execute
            </Button>
            <FormControl subtitle="View execution transaction hash" title="Transaction Hash">
              <TransactionHash hash={lastTx} />
            </FormControl>
          </div>
          <FormControl subtitle="View current message to be sent" title="Payload Preview">
            <JsonPreview content={previewExecutePayload(payload)} isCopyable />
          </FormControl>
        </div>
      </form>
    </section>
  )
}

export default withMetadata(WasmBaseExecutePage, { center: false })
