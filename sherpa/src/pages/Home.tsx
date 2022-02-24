import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import {
  NetworkName,
  getChainHexByNetworkName,
  getNetworkByNetworkName,
} from '../WalletContext/constants'
import { InjectedConnector } from '@web3-react/injected-connector'
import { isMobile } from 'react-device-detect'
import { ToggleButton } from 'components/ToggleButton'
import { InformationCircleIcon } from '@heroicons/react/outline'
import DepositStat from 'components/DepositStat'
import { injected } from 'connectors'
import WithdrawScreen from '../components/WithdrawScreen'
import DepositScreen from 'components/DepositScreen'
import * as sherpa from 'sherpa'

const injectedProvider = new InjectedConnector({})

export const AVAXContracts = [
  {
    val: 10,
    address: '0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f',
  },
  {
    val: 100,
    address: '0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f',
  },
  {
    val: 500,
    address: '0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f',
  },
]

const Home = () => {
  const [transaction, setTransaction] = useState<'deposit' | 'withdraw'>(
    'deposit'
  )

  const [selectedContract, setSelectedContract] = useState(AVAXContracts[0])

  const { library, active, activate, deactivate } = useWeb3React()

  const connectToWallet = async () => {
    await activate(injectedProvider)
  }

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized || (isMobile && window.ethereum)) {
        activate(injected)
        // next line is a for for: https://giters.com/NoahZinsmeister/web3-react/issues/257
        window?.ethereum?.removeAllListeners(['networkChanged'])
      }
    })
  }, [activate])

  return (
    <div>
      {console.log(library)}
      <div tw="bg-contain bg-sherpa-bg w-[522px]  flex justify-center items-stretch px-[34px] py-[23px] gap-[15px]">
        <div tw="flex flex-col rounded-md w-1/2 backdrop-filter backdrop-blur-md bg-white bg-opacity-50  px-[15px] py-[9px] ">
          <div tw="bg-white rounded-full flex">
            <ToggleButton
              onClick={() => setTransaction('deposit')}
              disabled={transaction === 'deposit'}
            >
              Deposit
            </ToggleButton>
            <ToggleButton
              onClick={() => setTransaction('withdraw')}
              disabled={transaction === 'withdraw'}
            >
              Withdraw
            </ToggleButton>
          </div>
          {transaction === 'deposit' ? (
            <DepositScreen
              selectedContract={selectedContract}
              setSelectedContract={setSelectedContract}
            />
          ) : (
            <WithdrawScreen selectedContract={selectedContract} />
          )}
        </div>

        <div tw="rounded-md w-1/2 backdrop-filter backdrop-blur-md bg-[#24466D] bg-opacity-50  px-[15px] py-[9px] ">
          <div tw="flex">
            <div tw="text-white text-[11px] font-bold">STATISTICS</div>
            <div tw="ml-auto">
              <div tw="rounded-[4px]  bg-primary text-secondary p-[6px] text-[11px] font-bold">
                10
              </div>
            </div>
          </div>
          <div tw="flex mt-2">
            <span tw="text-[10px] text-white">Anonymity Set</span>
            <InformationCircleIcon tw="mb-2 h-2 w-2 text-white" />
            <div tw="text-[7px] text-white ml-auto mr-1">AVAX</div>
          </div>

          <div tw="flex mt-1 items-center">
            <div tw="rounded-[4px]  bg-primary text-secondary py-[4px] px-[11px] text-[11px] font-bold">
              4685
            </div>
            <span tw="text-[9px] ml-[5px] text-white">equal user deposits</span>
          </div>

          <div tw="text-[10px] text-white mt-[12px]">Anonymity Set</div>
          <div tw="grid grid-cols-2 grid-rows-6 grid-flow-col gap-y-[6px] mt-1">
            {Array(12)
              .fill(undefined)
              .map((ele) => {
                return <DepositStat key={ele} />
              })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

const switchNetwork = async (networkName: NetworkName) => {
  console.log(networkName)
  console.log(getChainHexByNetworkName(networkName))
  //todo make this more generic -- ie switch network for non evm
  await window?.ethereum
    ?.request({
      method: 'wallet_switchEthereumChain',

      params: [{ chainId: getChainHexByNetworkName(networkName) }],
    })
    .catch((err: any) => {
      console.log(err)
      const { blockExplorerUrl, chainHex, name, nativeCurrency, rpcUrl } =
        getNetworkByNetworkName(networkName)

      window?.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            blockExplorerUrls: [blockExplorerUrl],
            chainId: chainHex,
            chainName: name,
            nativeCurrency,
            rpcUrls: [rpcUrl],
          },
        ],
      })
    })
}

// const With = () => {
//   return (
//     <div>
//       <div tw="flex w-full mt-2">
//         <div>
//           <div tw="flex">
//             <span tw="font-medium text-[9px]">Relayer Mode</span>
//             <InformationCircleIcon tw="mb-2 h-2 w-2" />
//           </div>
//           <ToggleSwitch />
//         </div>

//         <div tw="ml-2">
//           <div tw="flex">
//             <span tw="font-medium text-[9px]">Relayer Fee</span>
//             <InformationCircleIcon tw="mb-2 h-2 w-2" />
//           </div>
//           <Select />
//         </div>
//       </div>

//       <div>
//         <div tw="flex">
//           <span tw="font-medium text-[9px]">Unique Key</span>
//           <InformationCircleIcon tw="mb-2 h-2 w-2" />
//         </div>
//         <input
//           tw="px-2 rounded-sm text-[7px] h-[26px] w-full bg-primary text-white placeholder:text-[#707070]"
//           placeholder="Insert Unique Key Here"
//         />
//       </div>

//       <div tw="mt-[6px]">
//         <div tw="flex">
//           <span tw="font-medium text-[9px]">Recipient Wallet Address</span>
//           <InformationCircleIcon tw="mb-2 h-2 w-2" />
//         </div>
//         <input
//           tw="px-2 rounded-sm text-[7px] h-[26px] w-full bg-primary text-white placeholder:text-[#707070]"
//           placeholder="Insert Address Here"
//         />
//       </div>

//       <button tw="mt-[7px] rounded-full w-full h-[28px] text-primary text-[11px] bg-white">
//         Withdraw
//       </button>
//     </div>
//   )
// }
