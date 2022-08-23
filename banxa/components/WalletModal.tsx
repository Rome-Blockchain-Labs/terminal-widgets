import { XIcon } from '@heroicons/react/solid'
import { SUPPORTED_WALLETS, useWallets } from '@romeblockchain/wallet'
import { FC, ReactNode, useState } from 'react'

import { classNames } from '../utils/style'
import MetamaskLogo from './icons/MetamaskLogo'
import WalletConnectLogo from './icons/WalletConnectLogo'

const WalletModal = ({ setWalletVisibility }: { setWalletVisibility: (val: boolean) => void }) => {
  const { handleConnect, selectedWallet, setSelectedWallet } = useWallets()
  const [loading, setLoading] = useState(false)

  if (loading) {
    return (
      <>
        <div className="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
        <div className="fixed top-0 w-full h-full z-30 flex justify-center items-center">
          <svg
            aria-hidden="true"
            className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="fixed top-0 z-20 w-full h-full bg-black bg-opacity-80" />
      <div className="fixed top-0 w-full h-full z-30 flex justify-center items-center">
        <div className="rounded-lg h-fit mx-3 p-6 w-full  min-h-[215px] md:mx-0 md:w-1/2 bg-gray-800 flex flex-wrap justify-center items-center rounded-10 h-fit-content max-w-lg">
          <div className="w-full text-[#C1FF00] flex">
            <span>SELECT WALLET</span>
            <button
              className="ml-auto mr-3 "
              onClick={() => {
                setWalletVisibility(false)
              }}
            >
              <XIcon color="#C1FF00" height={17} width={17} />
            </button>
          </div>
          <hr className="w-full bg-gray-50 mt-2" />
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
                    setWalletVisibility(false)
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
      </div>
    </>
  )
}

export default WalletModal

const WalletBox: FC<{
  isActive: boolean
  walletName: string
  connectHandler: () => void
  children: ReactNode
}> = (props) => {
  const { connectHandler, isActive, walletName } = props
  return (
    <HoverBox active={isActive} text={walletName.toUpperCase().replaceAll('_', ' ')} onClick={connectHandler}>
      {props.children}
    </HoverBox>
  )
}

const HoverBox: FC<{
  active: boolean
  text: string
  onClick: () => void
  children: ReactNode
}> = (props) => {
  const { active, onClick, text } = props

  return (
    <div
      onClick={onClick}
      className={classNames(
        active ? 'border-yellow-400' : 'border-gray-400',
        'text-gray-200 flex items-center w-28 h-28 rounded border border-solid  p-3 cursor-pointer justify-center text-center  hover:bg-gray-400 hover:font-bold  grayscale-0 transition m-5 text-sm'
      )}
    >
      <div>
        <div className="m-auto mb-3 w-auto max-w-min">{props.children}</div>
        <div className="leading-4">{text}</div>
      </div>
    </div>
  )
}
