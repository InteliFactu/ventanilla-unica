import type { DgsfpAttachment } from '../types/DgsfpAttachment'
import type { DgsfpComplaintQuery } from '../types/DgsfpComplaintQuery'
import { readAttachment } from './readAttachment'

/**
 * The PDFs by control: the writ ("Resumen", `sMotivo`), the proof of the
 * prior complaint to the entity's customer service (`fSACDEC`), the policy
 * conditions (`fCondicionesGenerales`) and one more annex (`sAnexos`). Each
 * control takes a single file; merge several into one PDF beforehand.
 */
export const readComplaintFiles = async (
  files: DgsfpComplaintQuery['files'],
): Promise<readonly DgsfpAttachment[]> => {
  const wanted: readonly (readonly [string, string | undefined])[] = [
    ['sMotivo', files.escrito],
    ['fSACDEC', files.sac],
    ['fCondicionesGenerales', files.condiciones],
    ['sAnexos', files.anexo],
  ]
  return Promise.all(
    wanted
      .filter(
        (entry): entry is readonly [string, string] => entry[1] !== undefined,
      )
      .map(async ([field, path]) => readAttachment(field, path)),
  )
}
