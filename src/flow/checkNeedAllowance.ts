import type { TAllowance, TGiaContractName } from '../types/allowance'
import type { TGiaRoute } from '../types/route'

function getAllowance(route: TGiaRoute, allowances: TAllowance[]) {
  const fromAddress = route.fromToken.address
  const toAddress = route.toToken.address

  const contractName: TGiaContractName = fromAddress === toAddress ? 'ViaGaslessRelay' : 'ViaRouter'

  return allowances.find(
    allowance => allowance.contractName === contractName && allowance.tokenAddress === fromAddress && allowance.chainId === route.fromToken.chainId
  )
}

async function checkNeedAllowance(route: TGiaRoute, allowances: TAllowance[]): Promise<boolean> {
  const allowance = getAllowance(route, allowances)

  if (!allowance) {
    throw new Error('Allowance not found')
  }

  return BigInt(allowance.value) < BigInt(route.fromToken.amount)
}

export { getAllowance, checkNeedAllowance }
