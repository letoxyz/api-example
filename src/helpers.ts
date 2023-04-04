import type { TGiaRoute } from './types/route'

function isValidEthereumAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

function checkTransferRoute(route: TGiaRoute) {
  const { fromToken, toToken } = route

  return fromToken.address === toToken.address && fromToken.chainId === toToken.chainId
}

export { isValidEthereumAddress, checkTransferRoute }
