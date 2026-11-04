import { readFile } from 'node:fs/promises'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { youthGuaranteeVerificationFiles } from '../fixtures/youthGuaranteeVerificationFiles'
import { waitForYouthGuaranteeFile } from './waitForYouthGuaranteeFile'

vi.mock('node:fs/promises', () => ({ readFile: vi.fn() }))

describe('verification file polling', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.resetAllMocks()
  })
  it('keeps the process waiting in five-second intervals until digits arrive', async () => {
    vi.useFakeTimers()
    vi.mocked(readFile)
      .mockRejectedValueOnce(
        Object.assign(new Error('missing'), { code: 'ENOENT' }),
      )
      .mockResolvedValueOnce('  ')
      .mockResolvedValueOnce('012345\n')
    const result = waitForYouthGuaranteeFile(
      youthGuaranteeVerificationFiles.pinFile,
      'pin',
    )
    await vi.advanceTimersByTimeAsync(10_000)
    await expect(result).resolves.toBe('012345')
  })
  it('times out at thirty minutes without exposing or resending a code', async () => {
    vi.useFakeTimers()
    vi.mocked(readFile).mockResolvedValue('')
    const pending = waitForYouthGuaranteeFile(
      youthGuaranteeVerificationFiles.pinFile,
      'pin',
    )
    const advance = vi.advanceTimersByTimeAsync(30 * 60 * 1000)
    await expect(pending).rejects.toThrow(/timed out after 30 minutes/)
    await advance
  })
  it('stops on permission errors instead of treating them as a pending file', async () => {
    vi.mocked(readFile).mockRejectedValue(
      Object.assign(new Error('sensitive path'), { code: 'EACCES' }),
    )
    await expect(
      waitForYouthGuaranteeFile(youthGuaranteeVerificationFiles.pinFile, 'pin'),
    ).rejects.toThrow('cannot read verification file')
  })
  it('rejects non-digits without including the content in the error', async () => {
    vi.mocked(readFile).mockResolvedValue('sensitive-content')
    await expect(
      waitForYouthGuaranteeFile(youthGuaranteeVerificationFiles.pinFile, 'pin'),
    ).rejects.toThrow('Garantía Juvenil: PIN file must contain only digits')
  })
})
