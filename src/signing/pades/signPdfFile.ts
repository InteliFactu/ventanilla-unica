import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { selectCommonName } from './selectors/selectCommonName'
import { signPdf } from './signPdf'
import { signPdfTimestamped } from './signPdfTimestamped'
import type { SignPdfFileRequest } from './types/SignPdfFileRequest'
import type { SignPdfFileResult } from './types/SignPdfFileResult'

/** Read a PDF, sign it (PAdES-B-B, incremental update) and write the signed copy; never overwrites the input. */
export const signPdfFile = async (
  identity: CertificateIdentity,
  request: SignPdfFileRequest,
): Promise<SignPdfFileResult> => {
  if (resolve(request.input) === resolve(request.output)) {
    throw new Error(
      '--out must differ from --in: the original is never overwritten',
    )
  }
  // The paths are the holder's own, given on the command line: reading and
  // writing them is the feature, not an injection surface.
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const original = await readFile(request.input)
  const signed =
    request.timestamp === undefined
      ? signPdf(identity, original, request.options)
      : await signPdfTimestamped(identity, original, {
          ...request.options,
          timestamp: request.timestamp,
        })
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  await writeFile(request.output, signed)
  return {
    input: request.input,
    output: request.output,
    bytes: signed.length,
    signer: selectCommonName(identity),
    visible: request.options.visible === true,
    subFilter: request.options.subFilter ?? 'ETSI.CAdES.detached',
  }
}
