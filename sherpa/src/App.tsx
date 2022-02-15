import './App.css'
import { useWallets } from './WalletContext/WalletContext'
import WalletSelectionModal from './WalletContext/WalletSelectionModal'
import WalletButton from './WalletContext/WalletButton'

function App() {
  const { active, library, connectToWallet } = useWallets()

  if (active) {
    console.log(library.getSigner())
  }
  return (
    <>
      {console.log('is active', active)}
      <button onClick={() => connectToWallet('metamask')}>connect</button>
      <WalletButton />
      <WalletSelectionModal>asdasd</WalletSelectionModal>
    </>
  )
}

export default App
