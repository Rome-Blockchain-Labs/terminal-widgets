import './App.css'
import { useWallets } from './WalletContext/WalletContext'
import { useEffect } from 'react'
import WalletSelectionModal from './WalletContext/WalletSelectionModal'
import WalletButton from './WalletContext/WalletButton'

function App() {
  const { active, library, connectToWallet } = useWallets()

  return (
    <>
      <button onClick={() => connectToWallet('metamask')}>connect</button>
      <WalletButton />
      <WalletSelectionModal>asdasd</WalletSelectionModal>
    </>
  )
}

export default App
