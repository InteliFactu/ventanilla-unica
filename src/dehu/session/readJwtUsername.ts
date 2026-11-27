import { asRecord } from '../api/asRecord'
import { readTextOrNull } from '../api/readTextOrNull'

/** Read DEHU's authenticated holder NIF from the session token. */
export const readJwtUsername = (jwt: string): string => {
  const payload = jwt.split('.')[1] ?? ''
  let claims: unknown
  try {
    claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch {
    claims = undefined
  }
  const username = readTextOrNull(asRecord(claims)?.['username'])
  if (username === null)
    throw new Error('DEHU: the session token names no holder')
  return username
}
