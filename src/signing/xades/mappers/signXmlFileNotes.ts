import { basename } from 'node:path'

import type { SignXmlFileRequest } from '../types/SignXmlFileRequest'

/** What the holder needs to know about the file just written. */
export const signXmlFileNotes = (
  request: SignXmlFileRequest,
  contentIsXml: boolean,
): string[] => {
  const notes: string[] = []
  if (request.mode === 'detached')
    notes.push(
      `the signature references "${basename(request.input)}" by name: keep both files together`,
    )
  if (request.mode === 'enveloping' && !contentIsXml)
    notes.push('the input is not XML: it is carried in base64 inside ds:Object')
  if (request.policy === 'facturae' && request.mode !== 'enveloped')
    notes.push('FACe and the AEAT expect Facturae signed enveloped')
  if (request.policy === 'age' && request.mode === 'enveloping')
    notes.push('the AGE policy asks for enveloped or detached signatures')
  return notes
}
