import { describe, expect, it } from 'vitest'

import { writeTestPdf } from '../../tgss/attachments/fixtures/writeTestPdf'
import { readQuestionText } from './readQuestionText'

describe('readQuestionText', () => {
  it('reads and trims UTF-8 text', async () => {
    const path = await writeTestPdf('q.txt', '  ¿Se exige solvencia?\n')
    await expect(readQuestionText(path)).resolves.toBe('¿Se exige solvencia?')
  })

  it('refuses empty files', async () => {
    const path = await writeTestPdf('q.txt', ' \n')
    await expect(readQuestionText(path)).rejects.toThrow('is empty')
  })
})
