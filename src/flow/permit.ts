import type { JsonRpcSigner } from 'ethers'
import { zeroPadValue } from 'ethers'
import { DaiPermitMessage, EIP712PermitDomains, MAX_UINT256, PermitMessage, SUPPORTED_TOKENS } from '../constants'
import type { TAllowance } from '../types/allowance'
import type { TDaiPermitMessage, TPermitDomain, TPermitMessage, TPermitToken, TPermitTypes } from '../types/permit'
import type { TGiaRoute } from '../types/route'
import { getAllowance } from './checkNeedAllowance'
import { call, signData } from './rpc'

function getPermitToken(route: TGiaRoute) {
  const { address, chainId } = route.fromToken

  return Object.values(SUPPORTED_TOKENS).flat().find(
    t =>
      t.address.toLowerCase() === address.toLowerCase()
        && t.chainId === chainId
  )
}

function addZeros(numZeros: number) {
  return ''.padEnd(numZeros, '0')
}

async function getPermitDomain(permitToken: TPermitToken): Promise<TPermitDomain> {
  const { address, chainId, name, version } = permitToken

  const domain: TPermitDomain = {
    name,
    version: version || '1',
    verifyingContract: address
  }

  if (chainId === 1) {
    domain.chainId = chainId
  } else {
    domain.salt = zeroPadValue(`0x${chainId.toString(16).padStart(32, '0')}`, 32)
  }

  return domain
}

function createTypedDaiData(message: TDaiPermitMessage, domain: TPermitDomain, chainId: number) {
  if (!Object.keys(EIP712PermitDomains).includes(chainId.toString())) {
    throw new Error('ChainId not supported')
  }

  const typedData = {
    types: {
      // @ts-expect-error – Check type above
      EIP712Domain: EIP712PermitDomains[chainId]!,
      Permit: DaiPermitMessage
    },
    primaryType: 'Permit',
    domain,
    message
  }

  return typedData
}

function createTypedPermitData(message: TPermitMessage, domain: TPermitDomain, chainId: number) {
  if (!Object.keys(EIP712PermitDomains).includes(chainId.toString())) {
    throw new Error('ChainId not supported')
  }

  const typedData = {
    types: {
      // @ts-expect-error – Check type above
      EIP712Domain: EIP712PermitDomains[chainId]!,
      Permit: PermitMessage
    },
    primaryType: 'Permit',
    domain,
    message
  }

  return typedData
}

async function getPermitNonce(signer: JsonRpcSigner, token: TPermitToken): Promise<string> {
  const owner = await signer.getAddress()
  const { address, noncesFn } = token

  return call(signer, address, `${noncesFn}${addZeros(24)}${owner.slice(2)}`)
}

function isTokenExists(tokens: TPermitToken[], token: TPermitToken) {
  return tokens.find(t => t.address.toLowerCase() === token.address.toLowerCase() && t.chainId === token.chainId)
}

function getTokenKey(token: TPermitToken) {
  const entry = Object.entries(SUPPORTED_TOKENS).find(([_, tokens]) => isTokenExists(tokens, token))
  if (!entry) {
    throw new Error('Token not supported')
  }

  return entry[0] as TPermitTypes
}

async function permit(route: TGiaRoute, allowances: TAllowance[], signer: JsonRpcSigner) {
  const token = getPermitToken(route)!
  const { chainId } = token
  const owner = await signer.getAddress()
  const spender = getAllowance(route, allowances)?.contractAddress

  if (!token) {
    throw new Error('Token not supported')
  }

  if (!spender) {
    throw new Error('Spender not found')
  }

  const permitNonce = parseInt(await getPermitNonce(signer, token))
  const domain = await getPermitDomain(token)

  const getTypedData = () => {
    switch (getTokenKey(token)) {
      case 'DAI': {
        const message: TDaiPermitMessage = {
          holder: owner,
          spender,
          nonce: permitNonce,
          expiry: BigInt(MAX_UINT256),
          allowed: true
        }
        return createTypedDaiData(message, domain, chainId)
      }
      case 'ERC2612': {
        const message: TPermitMessage = {
          owner,
          spender,
          value: BigInt(MAX_UINT256),
          nonce: permitNonce,
          deadline: BigInt(MAX_UINT256)
        }
        return createTypedPermitData(message, domain, chainId)
      }
      default:
        throw new Error('Token not supported')
    }
  }

  const typedData = getTypedData()
  return signData(signer, owner, typedData)
}

export { permit }
