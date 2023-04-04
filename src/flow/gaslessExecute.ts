import type { JsonRpcSigner, Signature } from 'ethers'
import { API_URL, TypesExecute } from '../constants'
import type { TAllowance } from '../types/allowance'
import type { TGiaRoute } from '../types/route'
import { getGaslessRelay } from './gasless'

async function gaslessExecute(route: TGiaRoute, signer: JsonRpcSigner, allowances: TAllowance[], permit?: Signature) {
  const { recipientAddress, senderAddress, fromToken, gasless } = route
  const { amount, address } = fromToken

  const { quoteCallData, executeCallData, executeValue, quoterAddress } = gasless.executeExtra

  const gaslessRelay = getGaslessRelay(route, allowances)

  const fee = route.gasless.fee.withBonus || '0' // this is a string

  const signConfig = {
    token: address,
    amount,
    quoter: quoterAddress,
    quoteData: quoteCallData === '0x' ? quoteCallData : `0x${quoteCallData}`,
    fee,
    executionData: `0x${executeCallData}`,
    value: executeValue || '0'
  }

  const signedMessage = await signer.signTypedData(gaslessRelay, TypesExecute, signConfig)
  const urlParams = new URLSearchParams({
    routeUUID: route.uuid,
    signedMessage,
    recipientAddress,
    senderAddress
  })

  if (permit) {
    urlParams.append('permitR', permit.r.slice(2))
    urlParams.append('permitS', permit.s.slice(2))
    urlParams.append('permitV', permit.v.toString())
  }

  const url = `${API_URL}v1/leto/gasless-execute?${urlParams.toString()}`

  const res = await fetch(url, {
    method: 'GET'
  })

  return res.json()
}

export { gaslessExecute }
