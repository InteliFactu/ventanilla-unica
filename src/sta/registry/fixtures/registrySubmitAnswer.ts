import type { HttpRequestOptions } from '../../../http/types/HttpRequestOptions'

/** What `POST /requests/<procedure>` answers: nothing for drafts and the `sign` save, the registry entry for the submission. */
export const registrySubmitAnswer = (options?: HttpRequestOptions): string =>
  (JSON.parse(String(options?.body)) as { mode: string }).mode === ''
    ? JSON.stringify({
        id: '20260000001',
        date: '2026-10-03T17:36:24.955Z',
        document: { cud: 'CSV1' },
      })
    : ''
