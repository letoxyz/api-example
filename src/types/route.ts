import type { TSupportedChain } from './allowance'

type THash = `0x${string}`

type TSimpleTxData = {
  gas?: string
  gasActionUnits?: string
  gasLimit?: string
  from?: THash
  to: THash
  gasPrice?: string
  value: string
  data?: THash
  chainId?: number
}

type TToken = {
  address: THash
  amount: string
  amountHumanReadable: number
  chainId: TSupportedChain
  decimals: number
  logoURI: string
  name: string
  symbol: string
  coingeckoId: string
}

type TGiaRoute = {
  approveTx: TSimpleTxData | null
  estimateTimeSeconds: number
  fromToken: TToken
  gasless: {
    executeExtra: {
      executeCallData: THash
      executeValue: string
      quoteCallData: THash
      quoterAddress: THash
    }
    fee: {
      withBonus: string
      withoutBonus: string
      withBonusHR: number
      withoutBonusHR: number
    }
    flashbotApproval: {
      gasPrice: string
      gasLimit: string
    }
  }
  privateMode: boolean
  provider: number
  recipientAddress: THash
  senderAddress: THash
  toToken: TToken
  tx: TSimpleTxData
  uuid: string
}

export type { TGiaRoute }
