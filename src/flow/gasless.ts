import type { TypedDataDomain } from 'ethers'
import { zeroPadValue } from 'ethers'
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

export { getGaslessRelay }
