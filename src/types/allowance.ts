type TSupportedChain = number
type TGiaContractName = 'ViaGaslessRelay' | 'ViaRouter' | 'ViaMetaPayments'

type TAllowance = {
  chainId: TSupportedChain
  value: string
  tokenAddress: string
  contractAddress: string
  contractName: TGiaContractName
}

type TGetAllowancesResponse = {
  allowances: TAllowance[]
}

export type { TGiaContractName, TGetAllowancesResponse, TSupportedChain, TAllowance }
