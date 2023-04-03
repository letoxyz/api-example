import { BrowserProvider, Signer } from 'ethers'
import { useState } from 'react'
import './App.css'
import { isValidEthereumAddress } from './helpers'

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  const [signer, setSigner] = useState<Signer | null>(null)

  const [targetWallet, setTargetWallet] = useState<string | null>(null)
  const [walletError, setWalletError] = useState<string | null>(null)

  const connectWallet = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      setProvider(provider)
      setSigner(signer)
    } catch (e) {
      console.error(e)
    }
  }

  const handleTargetWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wallet = e.target.value
    setTargetWallet(wallet)

    if (wallet && !isValidEthereumAddress(wallet)) {
      setWalletError('Invalid Ethereum address')
    } else {
      setWalletError(null)
    }
  }

  return (
    <div className="App">
      <h1>Leto integration example</h1>
      {/* Auth button */}
      {!signer && (<button type='button' onClick={connectWallet}>Connect wallet</button>)}

      {/* Flow */}
      {signer && (
        <div>
          <h2>Send money</h2>
          <input
            type='text'
            placeholder='Target wallet'
            onChange={handleTargetWalletChange}
            className={walletError ? 'error' : ''}
          />
          {walletError && <p className="error-message">{walletError}</p>}
          <button
            type='button'
            onClick={() => console.log('Send money to', targetWallet)}
            disabled={!targetWallet || !!walletError}
          >
            Send
          </button>

        </div>
      )}
    </div>
  )
}

export default App
