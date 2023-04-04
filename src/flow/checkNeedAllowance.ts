import { checkTransferRoute } from '../helpers'
import type { TAllowance, TGiaContractName } from '../types/allowance'
import type { TGiaRoute } from '../types/route'

function getAllowance(route: TGiaRoute, allowances: TAllowance[]) {
  const { address, chainId } = route.fromToken

  const contractName: TGiaContractName = checkTransferRoute(route) ? 'ViaGaslessRelay' : 'ViaRouter'

  return allowances.find(
    a => a.contractName === contractName && a.tokenAddress === address && a.chainId === chainId
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
