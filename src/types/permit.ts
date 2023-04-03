type TDaiPermitMessage = {
  holder: string
  spender: string
  nonce: number
  expiry: BigInt
  allowed?: boolean
}

type TPermitMessage = {
  owner: string
  spender: string
  value: BigInt
  nonce: number
  deadline: BigInt
}

type TPermitDomain = {
  name: string
  version: string
  chainId?: number
  salt?: string
  verifyingContract: string
}

type TRSVResponse = {
  r: string
  s: string
  v: number
}

const PERMIT_TYPES = ['ERC2612', 'DAI'] as const

type TPermitTypes = typeof PERMIT_TYPES[number]

type TPermitToken = {
  address: string
  chainId: number
  name: string
  version?: string
  noncesFn?: string
  permitType?: TPermitTypes
}

type TPermitTokens = {
  [key in TPermitTypes]: TPermitToken[]
}

export { PERMIT_TYPES }
export type { TPermitToken, TPermitTokens, TPermitTypes, TDaiPermitMessage, TPermitMessage, TPermitDomain, TRSVResponse }
