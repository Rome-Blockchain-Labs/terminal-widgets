import { SUPPORTED_WALLETS, useWallets } from '@romeblockchain/wallet'
import React, { useState } from 'react'
import MetamaskLogo from './icons/MetamaskLogo'
import WalletConnectLogo from './icons/WalletConnectLogo'
import Loader from './Loader'
import { WalletBox } from './WalletModal'
const steps = [
  { id: 'Step 1', name: 'Select Wallet', href: '#', status: 'current' },
  { id: 'Step 2', name: 'Transfer Tokens', href: '#', status: 'upcoming' },
]

interface StepProps {
  id: string
  name: string
  href: string
  status: string
}

const Step = ({ id, name, href, status }: StepProps) => {
  return (
    <li key={name} className="flex-1">
      {status === 'complete' ? (
        <a
          href={href}
          className="group flex flex-col  border-indigo-600 py-2  hover:border-indigo-800  border-t-4  pt-4 "
        >
          <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">{id}</span>
          <span className="text-sm font-medium">{name}</span>
        </a>
      ) : status === 'current' ? (
        <a
          href={href}
          className="flex flex-col  border-indigo-600 py-2  border-l-0 border-t-4 pl-0 pt-4 pb-0"
          aria-current="step"
        >
          <span className=" text-sm font-bold text-indigo-600">{id}</span>
          <span className="text-sm font-bold">{name}</span>
        </a>
      ) : (
        <a href={href} className="group flex flex-col border-gray-200 py-2  hover:border-gray-300  border-t-4  pt-4 ">
          <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{id}</span>
          <span className="text-sm font-medium">{name}</span>
        </a>
      )}
    </li>
  )
}

const SellOrderModal = () => {
  const [loading, setLoading] = useState(false)

  if (loading) {
    return <Loader />
  }
  return (
    <>
      <div className="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div className="fixed top-0 w-full h-full z-30 grid place-items-center ">
        <div className="wg:rounded-lg w-full  wg:w-4/5 bg-white h-full wg:h-4/5  py-2 px-4 relative flex flex-col max-w-4xl">
          <nav aria-label="Progress" className="w-full">
            <ol role="list" className="flex space-y-0 space-x-8 ">
              {steps.map((step) => (
                <Step key={step.id} id={step.id} name={step.name} href={step.href} status={step.status} />
              ))}
            </ol>
          </nav>
          <div className="rounded-10 bg-gray-800 flex flex-col h-full ">
            <WalletStep />
          </div>
        </div>
      </div>
    </>
  )
}

export default SellOrderModal

const WalletStep = ({ setLoading }: any) => {
  const { handleConnect, selectedWallet, setSelectedWallet } = useWallets()
  return (
    <>
      {' '}
      <div className="text-white text-center m-6 wg:text-lg">
        Select which wallet you will use to transfer tokens from
      </div>
      <div className="flex-col wg:flex-row rounded-lg h-full mx-3 p-6   md:mx-0  flex flex-wrap justify-center items-center rounded-10 bg-gray-800">
        {Object.keys(SUPPORTED_WALLETS).map((key, index) => {
          const wallet = SUPPORTED_WALLETS[key]
          const isActive = selectedWallet === wallet.wallet

          return (
            <WalletBox
              key={index}
              connectHandler={async () => {
                setLoading(true)
                try {
                  await handleConnect(wallet.connector, setSelectedWallet, wallet.wallet, null, 1)
                  // setWalletVisibility(false)
                } catch (error) {
                  console.log(error)
                }
                setLoading(false)
              }}
              isActive={isActive}
              walletName={wallet.wallet}
            >
              {wallet.wallet === 'METAMASK' ? <MetamaskLogo size={30} /> : <WalletConnectLogo size={30} />}
            </WalletBox>
          )
        })}
      </div>
    </>
  )
}
