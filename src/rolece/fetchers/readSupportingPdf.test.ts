import { describe, expect, it } from 'vitest'

import { writeTestPdf } from '../../tgss/attachments/fixtures/writeTestPdf'
import { readSupportingPdf } from './readSupportingPdf'

describe('readSupportingPdf', () => {
  it('reads a PDF and refuses anything else', async () => {
    const pdf = await writeTestPdf('escritura.pdf')
    await expect(readSupportingPdf('escritura', pdf)).resolves.toMatchObject({
      fileName: 'escritura.pdf',
    })
    const text = await writeTestPdf('poderes.pdf', 'plain text')
    await expect(readSupportingPdf('poderes', text)).rejects.toThrow(
      '--poderes is not a PDF: poderes.pdf',
    )
  })
})
