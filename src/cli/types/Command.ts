import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import type { HttpClient } from '../../http/types/HttpClient'
import type { CliOptions } from './CliOptions'
import type { CommandEffect } from './CommandEffect'

/** One CLI command: `ventanilla-unica <portal> <action> [options]`. */
export type Command = {
  readonly portal: string
  readonly action: string
  readonly description: string
  /** Option names the command accepts beyond the global ones (`--cert`, `--key`, `--out`). */
  readonly options: readonly string[]
  /** Password commands use a network client without a certificate. */
  readonly login?: 'password' | undefined
  /** False for offline commands (validators, calendars) that must run without a certificate. */
  readonly needsCertificate?: false | undefined
  /** What the command does beyond reading; `read` when absent. */
  readonly effect?: CommandEffect | undefined
  run(
    client: HttpClient,
    options: CliOptions,
    identity?: CertificateIdentity,
  ): Promise<unknown>
}
