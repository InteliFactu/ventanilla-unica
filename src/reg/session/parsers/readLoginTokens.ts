import type { RegTokens } from '../types/RegTokens'

/** The `token` and `refreshToken` of the relay's landing URL, or undefined when the login failed (`loginKo`). */
export const readLoginTokens = (url: string): RegTokens | undefined => {
  const query = new URL(url).searchParams
  const token = query.get('token')
  const refreshToken = query.get('refreshToken')
  if (!token || !refreshToken) return undefined
  return { token, refreshToken }
}
