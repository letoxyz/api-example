import type { JsonRpcSigner } from 'ethers'
import type { TGiaRoute } from '../types/route'

async function setAllowance(route: TGiaRoute, signer: JsonRpcSigner) {
  const transaction = await signer.sendTransaction(route.approveTx)
}

export { setAllowance }
