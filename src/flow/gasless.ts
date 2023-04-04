import type { JsonRpcSigner, Signature, TypedDataDomain } from 'ethers'
import { randomBytes, zeroPadValue } from 'ethers'
import { API_URL, TypesExecute, TypesTransfer } from '../constants'
import type { TAllowance } from '../types/allowance'
import type { TGiaRoute } from '../types/route'

function getGaslessContractAddress(chainId: number, allowances: TAllowance[]) {
  return allowances.find(allowance => allowance.chainId === chainId && allowance.contractName === 'ViaGaslessRelay')
    ?.contractAddress as `0x${string}`
}

function getGaslessRelay(route: TGiaRoute, allowances: TAllowance[]): TypedDataDomain {
  const { chainId } = route.fromToken

  const verifyingContract = getGaslessContractAddress(chainId, allowances)
  return {
    name: 'Transfer Money',
    version: '1.0.0',
    chainId: zeroPadValue(`0x${chainId.toString(16).padStart(32, '0')}`, 32),
    verifyingContract
  }
}

async function gasless(route: TGiaRoute, signer: JsonRpcSigner, allowances: TAllowance[], permit?: Signature) {
  const { recipientAddress, fromToken, gasless } = route
  const { amount, address: token } = fromToken
  const { withBonus: fee } = gasless.fee

  const gaslessRelay = getGaslessRelay(route, allowances)

  const type = gasless.executeExtra ? 'execute' : 'transfer'
  const nonce = new DataView(randomBytes(32).buffer).getBigUint64(0, true).toString()

  const config = {
    token,
    amount,
    fee,
    ...(type === 'transfer'
      ? {
          to: recipientAddress,
          nonce
        }
      : {
          quoter: gasless.executeExtra.quoterAddress,
          quoteData:
          gasless.executeExtra.quoteCallData === '0x'
            ? gasless.executeExtra.quoteCallData
            : `0x${gasless.executeExtra.quoteCallData}`,
          executionData: `0x${gasless.executeExtra.executeCallData}`,
          value: gasless.executeExtra.executeValue || '0'
        })
  }

  const signedMessage = await signer.signTypedData(gaslessRelay, type === 'execute' ? TypesExecute : TypesTransfer, config)

  const params = {
    routeUUID: route.uuid,
    signedMessage,
    ...type === 'transfer' && {
      nonce
    },
    ...permit && {
      permitR: permit.r.slice(2),
      permitS: permit.s.slice(2),
      permitV: permit.v.toString()
    }
  }

  const url = `${API_URL}v1/leto/gasless-${type}`

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(params)
  })

  return res.json()
}

export { gasless }
