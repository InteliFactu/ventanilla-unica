import { parseTaxAddressReceipt } from '../../taxAddress/parsers/parseTaxAddressReceipt'
import type { DraftFileHeader } from '../types/DraftFileHeader'
import type { DraftSession } from '../types/DraftSession'
import type { SelfAssessmentReceipt } from '../types/SelfAssessmentReceipt'
import { writePresentationAnswers } from '../writePresentationAnswers'
import { signAndSend } from './signAndSend'

/** Sign and send from the open dialog, keep the raw answers under `outDir`, and read the receipt. */
export const sendAndKeepAnswers = async (
  session: DraftSession,
  dialogAnswer: string,
  header: DraftFileHeader,
  outDir?: string,
): Promise<SelfAssessmentReceipt> => {
  const answers = await signAndSend(session, dialogAnswer)
  const answersPath =
    outDir === undefined
      ? undefined
      : await writePresentationAnswers(outDir, header, answers)
  return {
    ...parseTaxAddressReceipt([...answers].reverse().join('\n')),
    answersPath,
  }
}
