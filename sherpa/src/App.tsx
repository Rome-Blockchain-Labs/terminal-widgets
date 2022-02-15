import { useWallets } from './WalletContext/WalletContext'
import WalletSelectionModal from './WalletContext/WalletSelectionModal'
import WalletButton from './WalletContext/WalletButton'
import { Contract } from '@ethersproject/contracts'
import CampaignFactory from './build/CampaignFactory.json'
import { useState } from 'react'
function App() {
  const FACTORY_ADDRESS = '0x1da8a83eD1e8d76B8dE28653E657Efc8295b1ee6'
  const { library } = useWallets()
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

  return (
    <div className="flex flex-col items-center gap-y-4">
      {loading && <div>getting campaigns...</div>}
      {campaigns && <div>{JSON.stringify(campaigns)}</div>}
      {/* <button onClick={() => connectToWallet('metamask')}>connect</button> */}
      <button onClick={initContract} className="border bg-slate-400">
        Instantiate Contract and get deployed campaign
      </button>
      <WalletButton />
      <WalletSelectionModal />
    </div>
  )
}

export default App
