import type { SignatureIdentity } from '../../appearance/types/SignatureIdentity'
import type { AeatPage } from './AeatPage'

/** Step 2, "Firma y envío": the form the firma básica submits, who it signs as and the files it lists. */
export type SignatureScreen = {
  readonly page: AeatPage
  readonly fields: Readonly<Record<string, string>>
  readonly signer: SignatureIdentity
  readonly fileNames: readonly string[]
}
