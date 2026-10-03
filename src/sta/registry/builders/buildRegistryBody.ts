import type { RegistryMode } from '../types/RegistryMode'
import type { RegistrySession } from '../types/RegistrySession'
import type { RegistrySlot } from '../types/RegistrySlot'

/**
 * The request body every save sends. `notification` and `legal` (the two
 * declarations, as timestamps of acceptance) only go once the summary step
 * is reached, i.e. from the `sign` save on.
 */
export const buildRegistryBody = (
  session: RegistrySession,
  slot: RegistrySlot,
  content: {
    readonly parties: Readonly<Record<string, unknown>>
    readonly data: readonly Readonly<Record<string, unknown>>[]
    readonly documents: readonly Readonly<Record<string, unknown>>[]
    readonly notificationEmail?: string | undefined
  },
  mode: RegistryMode,
): Readonly<Record<string, unknown>> => {
  const now = Date.now()
  const summary =
    content.notificationEmail === undefined
      ? {}
      : {
          notification: {
            type: 'electronic',
            value: content.notificationEmail,
          },
          legal: { privacy: now, affirmation: now },
        }
  return {
    parties: content.parties,
    ...summary,
    data: content.data,
    documents: content.documents,
    mode,
    reference: session.reference,
    progress: mode === 'draft' && content.documents.length === 0 ? 75 : 100,
    apordoc: {},
    infoDocs: [
      {
        id: slot.documentId,
        pid: false,
        reusable: false,
        dateEnd: '',
        reusableSelection: [],
      },
    ],
    taxInfo: {},
    taxPayment: false,
  }
}
