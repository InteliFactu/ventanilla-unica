import type { SignedApplication } from './SignedApplication'
import type { SigningScreen } from './SigningScreen'

/** Everything read and signed before the one post that files the application. */
export type PreparedApplication = {
  /** The simplified application form "Firmar y Enviar Solicitud" posted. */
  readonly application: {
    readonly action: string
    readonly fields: Readonly<Record<string, string>>
  }
  readonly screen: SigningScreen
  readonly signed: SignedApplication
}
