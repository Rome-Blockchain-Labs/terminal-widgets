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

const sherpaProxyAddress = '0xC0EB087ac8C732AC23c52A16627c4539d8966d79' //fuji
const selectedContractAddress = '0x66F4f64f9Dce3eB1476af5E1f530228b8eD0a63f' //fuji 10avax
const injectedProvider = new InjectedConnector({})
function App() {
  const [commitment, setCommitment] = useState()
  console.log(sherpa)
  const FACTORY_ADDRESS = '0x1da8a83eD1e8d76B8dE28653E657Efc8295b1ee6'

  const { library, active, activate, deactivate } = useWeb3React()

  const [campaigns, setCampaigns] = useState()
  const [loading, setLoading] = useState(false)
  // connect to rinkeby before clicking to init contract button
  const initContract = async () => {
    setLoading(true)
    const signer = library.getSigner()
    const contract = new Contract(FACTORY_ADDRESS, CampaignFactory.abi, signer)
    const c = await contract.getDeployedCampaigns()
    setCampaigns(c)
    setLoading(false)
  }

  const confirmDeposit = async () => {
    const signer = library.getSigner()
    const weiValue = 10
    const ethValue = ethers.utils.formatEther(weiValue)

    const netId = 43113
    const deposit = await sherpa.createDeposit(ethValue, 'avax', netId)
    console.log('withdrawl info within', deposit) //todo add download step
    const commitment = deposit.commitment
    await sherpa.sendDeposit(
      ethValue,
      sherpaProxyAddress,
      netId,
      selectedContractAddress,
      commitment,
      'avax',
      signer
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
    <div className="flex flex-col items-center gap-y-4">
      {console.log(active)}
      {loading && <div>getting campaigns...</div>}
      {campaigns && <div>{JSON.stringify(campaigns)}</div>}
      <button onClick={initContract} className="border bg-slate-400">
        Instantiate Contract and get deployed campaign
      </button>
      <div tw="bg-red-500 text-xl">{active}</div>
      <Button variant="primary" onClick={() => switchNetwork('Avalanche Fuji')}>
        switch network avalanche
      </Button>
      <Button variant="primary" onClick={() => connectToWallet()}>
        wallet connect
      </Button>
      <Button variant="primary" onClick={deactivate}>
        disconnect
      </Button>
      <Button onClick={confirmDeposit}>finalize deposit</Button>
    </div>
  )
}

export default App

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
