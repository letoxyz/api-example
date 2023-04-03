import type { JsonRpcSigner } from 'ethers'
import { Signature } from 'ethers'

function call(signer: JsonRpcSigner, to: string, data: string) {
  return signer.provider.send('eth_call', [{
    to,
    data
  }, 'latest'])
}

async function signData(signer: JsonRpcSigner, fromAddress: string, typeData: any) {
  const signerAddress = await signer.getAddress()
  if (signerAddress.toLowerCase() !== fromAddress.toLowerCase()) {
    throw new Error('Signer address does not match requested signing address')
  }

  const { EIP712Domain: _unused, ...types } = typeData.types
  const rawSignature = await signer.signTypedData(typeData.domain, types, typeData.message)

  return Signature.from(rawSignature)
}

export { call, signData }
