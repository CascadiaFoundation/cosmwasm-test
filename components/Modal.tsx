import clsx from 'clsx'
import { Button } from 'components/Button'
import { Radio } from 'components/Radio'
import { useEffect, useState } from 'react'
import { FaAsterisk } from 'react-icons/fa'

export const Modal = () => {
  const [showModal, setShowModal] = useState(true)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('disclaimer')) {
      setShowModal(false)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('disclaimer', '1')
    setShowModal(false)
  }

  return (
    <>
      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-auto max-w-3xl mx-auto my-6">
            <div className="flex relative flex-col w-full bg-stone-800 rounded-lg border-[1px] border-slate-200/20 border-solid outline-none focus:outline-none shadow-lg">
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200/20">
                <h3 className="text-3xl font-bold">Before using CascadiaTools...</h3>
              </div>
              <div className="relative flex-auto p-6 my-4">
                <p className="text-lg leading-relaxed">
                  CascadiaTools is a decentralized application where individuals or communities can use smart contract
                  dashboards to create tokens, distribute tokens, collect airdrops, etc...
                  <br /> These are all done by instantiating, invoking and querying smart contracts. <br />
                  <br />
                  CascadiaTools is made up of free, public, and open-source software that is built on top of cascadiad Network.
                  CascadiaTools only provides tools for any of the mentioned functionalities above and inside the dApp.
                  Anyone can airdrop or generate tokens on CascadiaTools. CascadiaTools does not search for any criteria for
                  airdrop listings, does not audit the functionality of the tokens. <br />
                  <br />
                  AS DESCRIBED IN THE DISCLAIMER, CascadiaTools IS PROVIDED “AS IS”, AT YOUR OWN RISK, AND WITHOUT
                  WARRANTIES OF ANY KIND. No developer or entity involved in creating the CascadiaTools will be liable for
                  any claims or damages whatsoever associated with your use, inability to use, or your interaction with
                  other users of the CascadiaTools, including any direct, indirect, incidental, special, exemplary, punitive
                  or consequential damages, or loss of profits, tokens, or anything else.
                </p>
              </div>
              <div className="flex justify-center">
                <Radio
                  checked={!isButtonDisabled}
                  htmlFor="disclaimer-accept"
                  id="disclaimer-accept"
                  onChange={() => setIsButtonDisabled(false)}
                  subtitle=""
                  title="I understand the risks and disclaimer of using CascadiaTools"
                />
              </div>
              <div className="flex items-center justify-end p-6 mt-1">
                <Button
                  className={clsx({ 'opacity-50': isButtonDisabled })}
                  disabled={isButtonDisabled}
                  isWide
                  onClick={accept}
                >
                  Enter CascadiaTools
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
