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

const injectedProvider = new InjectedConnector({})
function App() {
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

  const connectToWallet = async () => {
    console.log('connecting')

    await activate(injectedProvider)
  }
  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      console.log('is authorized', isAuthorized)
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
      <div tw="bg-red-500 text-xl">daksdksj</div>
      <Button variant="primary" onClick={() => switchNetwork('Rinkeby')}>
        switch network
      </Button>
      <Button variant="primary" onClick={() => connectToWallet()}>
        wallet connect
      </Button>
      <Button variant="primary" onClick={deactivate}>
        disconnect
      </Button>
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
