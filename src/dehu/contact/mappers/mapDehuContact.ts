import { asRecord } from '../../api/asRecord'
import { readTextOrNull } from '../../api/readTextOrNull'
import type { DehuContact } from '../types/DehuContact'

/** Map DEHU's flat `email1..email5` / `emailN_confirmacion` record into a list. */
export const mapDehuContact = (body: unknown, nif: string): DehuContact => {
  const record = asRecord(body) ?? {}
  const emails = [1, 2, 3, 4, 5].flatMap((slot) => {
    const email = readTextOrNull(record[`email${String(slot)}`])
    return email === null
      ? []
      : [
          {
            email,
            confirmed: record[`email${String(slot)}_confirmacion`] === 1,
          },
        ]
  })
  return {
    nif: readTextOrNull(record['nif']) ?? nif,
    emails,
    phone: readTextOrNull(record['telefono']),
    noticeTime: readTextOrNull(record['noticeTime']),
    updatedAt: readTextOrNull(record['updatedAt']),
  }
}
