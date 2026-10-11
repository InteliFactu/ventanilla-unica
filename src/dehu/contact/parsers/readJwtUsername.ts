import { asRecord } from '../../api/asRecord'
import { readTextOrNull } from '../../api/readTextOrNull'

/** The `username` claim of DEHU's session JWT: the holder's NIF, which the contact API wants base64-encoded in its path. */
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
