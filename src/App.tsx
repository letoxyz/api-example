import type { JsonRpcSigner, Signature } from 'ethers'
import { BrowserProvider } from 'ethers'
import type { ChangeEvent } from 'react'
import { useState } from 'react'

// 🚧 ETHERS 6.1.0 PATCH (signTypedData is broken – https://github.com/ethers-io/ethers.js/issues/3836) 🚧
import './patch'

import './App.css'

import { checkNeedAllowance, gasless, getAllowances, getRoute, permit, setAllowance } from './flow'
import { isValidEthereumAddress } from './helpers'
import { STEPS } from './constants'

function App() {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)

  const [targetWallet, setTargetWallet] = useState<string | null>(null)
  const [walletError, setWalletError] = useState<string | null>(null)
  const [successHash, setSuccessHash] = useState<string | null>(null)

  const [step, setStep] = useState(0)

  const connectWallet = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      setSigner(signer)
    } catch (e) {
      console.error(e)
    }
  }

  const sendMoney = async () => {
    // Checks required
    if (!signer || !targetWallet) {
      return
    }

    try {
      const address = await signer.getAddress()
      const amount = '0.1' // 🚧 Hardcode, in real app you should get amount from user input (e.g. input[type=number]) 🚧

      setStep(1)
      const { allowances } = await getAllowances(address)

      setStep(2)
      const route = await getRoute(amount, targetWallet, address)

      setStep(3)
      const isNeedAllowance = await checkNeedAllowance(route, allowances)

      setStep(4)
      await signer.provider.send('wallet_switchEthereumChain', [
        {
          chainId: `0x${route.fromToken.chainId.toString(16)}`
        }
      ])

      let permitResult: Signature | undefined

      if (isNeedAllowance) {
        setStep(5)
        try {
          permitResult = await permit(route, allowances, signer)
        } catch (e) {
          console.error(e)
          // Permit failed, try to approve
          await setAllowance(route, signer)
        }
      }

      setStep(6)

      const { txHash } = await gasless(route, signer, allowances, permitResult)

      // eslint-disable-next-line no-console
      console.log('Transaction hash:', txHash)

      // Finish!
      setStep(7)
      setSuccessHash(txHash)
    } catch (error) {
      console.error(error)
      setStep(0)
    }
  }

  const handleTargetWalletChange = (e: ChangeEvent<HTMLInputElement>) => {
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
            onClick={sendMoney}
            disabled={!targetWallet || !!walletError}
          >
            Send
          </button>

          {step > 0 && (
            <div className="progress">
              <p>
                {STEPS[step]}
              </p>
            </div>
          )}

          {successHash && (
            <div className="success">
              <p>
                Success! Transaction hash: {successHash}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
