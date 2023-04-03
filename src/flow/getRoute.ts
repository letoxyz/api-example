import { API_URL } from '../constants'
import type { TGiaRoute } from '../types/route'

async function getRoute(toTokenAmountHR: string, recipientAddress: string, senderAddress: string): Promise<TGiaRoute> {
  const urlParams = new URLSearchParams({
    senderAddress,
    recipientAddress,
    toTokenAmountHR
  })

  const url = `${API_URL}v3/leto/best-route?${urlParams.toString()}`

  const res = await fetch(url, {
    method: 'GET'
  })

  return res.json()
}

export { getRoute }
