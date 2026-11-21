import type { DraftNotice } from '../types/DraftNotice'

/** True when the AEAT answered with notices and none is an error: avisos do not stop a declaration. */
export const noticesHaveNoError = (notices: readonly DraftNotice[]): boolean =>
  notices.length > 0 && !notices.some((notice) => notice.kind === 'error')
