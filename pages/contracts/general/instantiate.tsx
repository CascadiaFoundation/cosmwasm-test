import { Alert } from 'components/Alert'
import { Button } from 'components/Button'
import { Conditional } from 'components/Conditional'
import { ContractPageHeader } from 'components/ContractPageHeader'
import { FormGroup } from 'components/FormGroup'
import { TextInput } from 'components/forms/FormInput'
import { useInputState } from 'components/forms/FormInput.hooks'
import { FormTextArea, JsonTextArea } from 'components/forms/FormTextArea'
import { JsonPreview } from 'components/JsonPreview'
import { LinkTabs } from 'components/LinkTabs'
import { wasmLinkTabs } from 'components/LinkTabs.data'
import { TextArea } from 'components/TextArea'
import { useContracts } from 'contexts/contracts'
import { useWallet } from 'contexts/wallet'
import type { InstantiateResponse } from 'contracts/cw721/base'
import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState, type FormEvent } from 'react'
import { toast } from 'react-hot-toast'
import { FaAsterisk } from 'react-icons/fa'
import { useMutation } from 'react-query'
import { CW721_BASE_CODE_ID } from 'utils/constants'
import { withMetadata } from 'utils/layout'
import { links } from 'utils/links'

const GeneralInstantiatePage: NextPage = () => {
  const wallet = useWallet()
  const contract = useContracts().wasm

  const codeIDState = useInputState({
    id: 'codeID',
    name: 'codeID',
    title: 'CodeID',
    placeholder: 'Contract CodeID',
  })
  
  const messageState = useInputState({
    id: 'message',
    name: 'message',
    title: 'Message',
    subtitle: 'Message content for current transaction',
    defaultValue: JSON.stringify({ key: 'value' }, null, 2),
  })


  const { data, isLoading, mutate } = useMutation(
    async (event: FormEvent): Promise<InstantiateResponse | null> => {
      event.preventDefault()
      if (!contract) {
        throw new Error('Smart contract connection failed')
      }

      const msg = messageState.value
      return toast.promise(
        contract.instantiate(+codeIDState.value, JSON.parse(messageState.value), 'CascadiaTools Wasm Base Contract', wallet.address),
        {
          loading: 'Instantiating contract...',
          error: 'Instantiation failed!',
          success: 'Instantiation success!',
        },
      )
    },
    {
      onError: (error) => {
        toast.error(String(error))
      },
    },
  )

  const txHash = data?.transactionHash

  return (
    <form className="px-12 py-6 space-y-4" onSubmit={mutate}>
      <NextSeo title="Instantiate CW721 Base Contract" />
      <ContractPageHeader
        description="Wasm Contract"
        link={links['Docs CW721 Base']}
        title="Wasm Contract"
      />
      <LinkTabs activeIndex={0} data={wasmLinkTabs} />

      <Conditional test={Boolean(data)}>
        <Alert type="info">
          <b>Instantiate success!</b> Here is the transaction result containing the contract address and the transaction
          hash.
        </Alert>
        <JsonPreview content={data} title="Transaction Result" />
        <br />
      </Conditional>

      <FormGroup subtitle="Basic information about your new contract" title="Contract Details">
        <TextInput isRequired {...codeIDState} />
        <JsonTextArea {...messageState} />
      </FormGroup>

      <div className="flex items-center p-4">
        <div className="flex-grow" />
        <Button isLoading={isLoading} isWide type="submit">
          Instantiate Contract
        </Button>
      </div>
    </form>
  )
}

export default withMetadata(GeneralInstantiatePage, { center: false })
