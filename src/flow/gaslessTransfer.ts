import type { JsonRpcSigner, Signature } from 'ethers'
import { randomBytes } from 'ethers'
import { API_URL, TypesTransfer } from '../constants'
import type { TAllowance } from '../types/allowance'
import type { TGiaRoute } from '../types/route'
import { getGaslessRelay } from './gasless'

async function gaslessTransfer(route: TGiaRoute, signer: JsonRpcSigner, allowances: TAllowance[], permit?: Signature) {
  const { recipientAddress, senderAddress } = route

  const gaslessRelay = getGaslessRelay(route, allowances)

  const nonce = new DataView(randomBytes(32).buffer).getBigUint64(0, true)
  const gaslessFeeAmount = route.gasless.fee.withBonus || '0' // this is a string

  const config = {
    token: route.fromToken.address,
    to: route.recipientAddress,
    amount: route.fromToken.amount.toString(),
    fee: gaslessFeeAmount,
    nonce: nonce.toString()
  }

  const signedMessage = await signer.signTypedData(
    gaslessRelay,
    TypesTransfer,
    config
  )

  const params: any = {
    nonce: nonce.toString(),
    routeUUID: route.uuid,
    signedMessage,
    recipientAddress,
    senderAddress
  }

  if (permit) {
    params.permitR = permit.r.slice(2)
    params.permitS = permit.s.slice(2)
    params.permitV = permit.v.toString()
  }

  const url = `${API_URL}v1/leto/gasless-transfer`

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(params)
  })

  return res.json()
}

export { gaslessTransfer }
