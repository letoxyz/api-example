import { API_URL } from '../constants'
import type { TGetAllowancesResponse } from '../types/allowance'

async function getAllowances(address: string): Promise<TGetAllowancesResponse> {
  const url = `${API_URL}v1/allowances?userAddress=${address}`

  const res = await fetch(url, {
    method: 'GET'
  })

  return res.json()
}

export { getAllowances }
