import { toMoneyAmount } from '../../money/mappers/toMoneyAmount'
import type { AgreementInstalment } from '../types/AgreementInstalment'
import { parseAgreementAmountCents } from './parseAgreementAmountCents'
import { parseAgreementDueDate } from './parseAgreementDueDate'

/** One published SRAF row in the order of the calendar's observed header. */
export const parseAgreementInstalment = (
  cells: readonly string[],
): AgreementInstalment => {
  if (cells.length !== 7)
    throw new Error('Unexpected AEAT instalment calendar row')
  const [debtKey, ordinal, phase, deadline, pending, interest, total] =
    cells as readonly [string, string, string, string, string, string, string]
  const number = Number(ordinal)
  const dueDate = parseAgreementDueDate(deadline)
  if (
    !/^[A-Z]\d{16}$/.test(debtKey) ||
    !/^\d+$/.test(ordinal) ||
    !Number.isSafeInteger(number) ||
    number < 1 ||
    !phase ||
    !dueDate
  )
    throw new Error('Unexpected AEAT instalment calendar row')
  const totalCents = parseAgreementAmountCents(total)
  if (
    parseAgreementAmountCents(pending) + parseAgreementAmountCents(interest) !==
    totalCents
  )
    throw new Error('Inconsistent amounts on an AEAT instalment calendar row')
  const currentTotal = toMoneyAmount(total)
  return {
    debtKey,
    number,
    phase,
    dueDate,
    pending: toMoneyAmount(pending),
    interest: toMoneyAmount(interest),
    total: currentTotal,
    // SRAF's documented paid marker is a zero total, with no remaining components.
    paid: totalCents === 0,
  }
}
