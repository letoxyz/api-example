import type { TPermitToken, TPermitTokens } from './types/permit'

const API_URL = 'https://api.staging.leto.xyz/gia/'

const ERC2612_TOKENS: TPermitToken[] = [
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    chainId: 1,
    name: 'USD Coin',
    noncesFn: '0x7ecebe00',
    version: '2'
  },
  {
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
    chainId: 137,
    noncesFn: '0x7ecebe00',
    name: 'USD Coin (PoS)'
  }
]

const DAI_TOKENS: TPermitToken[] = [
  {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    chainId: 1,
    noncesFn: '0x7ecebe00',
    name: 'Dai Stablecoin'
  },
  {
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI
    chainId: 137,
    noncesFn: '0x2d0335ab',
    name: '(PoS) Dai Stablecoin'
  }
]

const SUPPORTED_TOKENS: TPermitTokens = {
  DAI: DAI_TOKENS,
  ERC2612: ERC2612_TOKENS
}

const MAX_UINT256 = '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

const EIP712PermitDomains = {
  1: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'verifyingContract', type: 'address' },
    { name: 'chainId', type: 'uint256' }
  ],
  137: [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'salt', type: 'bytes32' },
    { name: 'verifyingContract', type: 'address' }
  ]
}

const DaiPermitMessage = [
  { name: 'holder', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
  { name: 'allowed', type: 'bool' }
]

const PermitMessage = [
  { name: 'owner', type: 'address' },
  { name: 'spender', type: 'address' },
  { name: 'value', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' }
]

export { API_URL, SUPPORTED_TOKENS, MAX_UINT256, EIP712PermitDomains, DaiPermitMessage, PermitMessage }
