import { Contract } from '@ethersproject/contracts'
import CampaignFactory from './build/CampaignFactory.json'
import { useEffect, useState } from 'react'
import tw, { styled, css, theme } from 'twin.macro'
import { useWeb3React } from '@web3-react/core'
import {
  NetworkName,
  getChainHexByNetworkName,
  getNetworkByNetworkName,
} from './WalletContext/constants'
import { InjectedConnector } from '@web3-react/injected-connector'
import { injected } from './connectors'
import { isMobile } from 'react-device-detect'
import * as sherpa from 'sherpa'
import { ethers } from 'ethers'
import web3 from './web3'
import { ToggleButton } from 'components/ToggleButton'
import { InformationCircleIcon } from '@heroicons/react/outline'
import { ToggleSwitch } from 'components/ToggleSwitch'
const sherpaProxyAddress = '0xC0EB087ac8C732AC23c52A16627c4539d8966d79' //fuji
const selectedContractAddress = '0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f' //fuji 10avax
const injectedProvider = new InjectedConnector({})
function App() {
  const [commitment, setCommitment] = useState()
  const [transaction, setTransaction] = useState<'deposit' | 'withdraw'>(
    'deposit'
  )
  console.log(sherpa)
  const FACTORY_ADDRESS = '0x1da8a83eD1e8d76B8dE28653E657Efc8295b1ee6'

  const { library, active, activate, deactivate } = useWeb3React()

  const [campaigns, setCampaigns] = useState()
  const [loading, setLoading] = useState(false)
  // connect to rinkeby before clicking to init contract button
  const initContract = async () => {
    setLoading(true)
    // const signer = library.getSigner()
    const accounts = await web3.eth.getAccounts()
    const instance = new web3.eth.Contract(CampaignFactory.abi, FACTORY_ADDRESS)
    const c = await instance.methods.getDeployedCampaigns().call()
    // const c = await instance.getDeployedCampaigns().call()
    // const contract = new Contract(FACTORY_ADDRESS, CampaignFactory.abi, signer)
    // const c = await contract.getDeployedCampaigns()
    setCampaigns(c)
    setLoading(false)
  }

  const confirmDeposit = async () => {
    // const signer = library.getSigner()

    const accounts = await web3.eth.getAccounts()
    // const weiValue = 10
    // const tokens = web3.utils.toWei(weiValue, 'avax')
    // const ethValue = ethers.utils.formatEther(weiValue)
    const weiToEther = (x) => x * 1e18
    const netId = 43113
    const deposit = await sherpa.createDeposit(weiToEther(10), 'avax', netId)
    console.log('withdrawl info within', deposit) //todo add download step
    const commitment = deposit.commitment
    await sherpa.sendDeposit(
      library,
      weiToEther(10),
      sherpaProxyAddress,
      netId,
      selectedContractAddress,
      commitment,
      'avax',
      accounts[0]
    )
  }

  const connectToWallet = async () => {
    await activate(injectedProvider)
  }
  useEffect(() => {
    const makeDeposit = async () => {
      const netId = 43113
      const deposit = await sherpa.createDeposit(10, 'avax', netId)
      setCommitment(deposit.commitment)

      console.log(deposit)
    }
    makeDeposit()
  }, [])

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
    <div className="">
      {console.log(transaction !== 'deposit', 'transaction')}

      {console.log(transaction !== 'withdraw', 'transaction')}
      {console.log(active)}
      {loading && <div>getting campaigns...</div>}
      {campaigns && <div>{JSON.stringify(campaigns)}</div>}
      {/* <button onClick={initContract} className="border bg-slate-400">
        Instantiate Contract and get deployed campaign
      </button>
      <div tw="bg-red-500 text-xl">{active}</div>
      <Button variant="primary" onClick={() => switchNetwork('Avalanche Fuji')}>
        switch network avalanche
      </Button>
      <Button variant="primary" onClick={() => switchNetwork('Rinkeby')}>
        connect to rinkeby
      </Button>
      <Button variant="primary" onClick={() => connectToWallet()}>
        wallet connect
      </Button>
      <Button variant="primary" onClick={deactivate}>
        disconnect
      </Button>
      <Button onClick={confirmDeposit}>finalize deposit</Button> */}
      {/* <div tw="bg-red-700">faldf</div> */}
      <Foo>
        <div className="hello">
          <div className="hi">hello</div>
        </div>
      </Foo>
      <hr tw="mb-4" />

      <div tw="bg-contain bg-sherpa-bg w-[522px] h-[266px] flex justify-center px-[34px] py-[23px] gap-[15px]">
        <div tw="rounded-md flex-grow backdrop-filter backdrop-blur-md bg-white bg-opacity-10  px-[15px] py-[9px] ">
          <div tw="bg-white rounded-full flex">
            <ToggleButton disabled={transaction !== 'deposit'}>
              Deposit
            </ToggleButton>
            <ToggleButton disabled={transaction !== 'withdraw'}>
              Withdraw
            </ToggleButton>
          </div>

          <div tw="flex w-full mt-2">
            <div>
              <div tw="flex">
                <span tw="font-medium text-[9px]">Relayer Mode</span>
                <InformationCircleIcon tw="mb-2 h-2 w-2" />
              </div>
              <ToggleSwitch />
            </div>

            <div>
              <div tw="flex">
                <span tw="font-medium text-[9px]">Relayer Mode</span>
                <InformationCircleIcon tw="mb-2 h-2 w-2" />
              </div>
            </div>
          </div>
        </div>

        <div tw="flex-grow border border-black">adfsdf</div>
      </div>
    </div>
  )
}

export default App
// const DepositButton = ({ disabled, children }) => {
//   return <ToggleButton disabled={disabled}>{children}</ToggleButton>
// }
// const WithdrawButton = ({ disabled, children }) => {
//   return <ToggleButton disabled={disabled}>{children}</ToggleButton>
// }
// const Input = ({ hasHover }) => (
//   <input css={[tw`text-black border`, hasHover && tw`hover:border-black`]} />
// )

// const Inputa = styled.input(({ hasHover }) => [
//   hasHover === 'primary' && tw`text-black bg-black border-black`,
// ])

const Button = styled.button(({ variant, isSmall }) => [
  // The common button styles added with the tw import
  tw`px-8 py-2 duration-75 transform rounded focus:outline-none`,

  // Use the variant grouping feature to add variants to multiple classes
  tw`hocus:(scale-105 text-yellow-400)`,

  // Use props to conditionally style your components
  variant === 'primary' && tw`text-white bg-black border-black`,

  // Combine regular css with tailwind classes within backticks
  variant === 'secondary' && [
    css`
      box-shadow: 0 0.1em 0 0 rgba(0, 0, 0, 0.25);
    `,
    tw`border-2 border-yellow-600`,
  ],

  // Conditional props can be used
  isSmall ? tw`text-sm` : tw`text-lg`,

  // The theme import can supply values from your tailwind.config.js
  css`
    color: ${theme`colors.white`};
  `,
])

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

const Foo = styled.div`
  .hello {
    .hi {
      ${tw`bg-red-800`}
    }
  }
`
