import { loadCertificateIdentity } from '../certificate/loadCertificateIdentity'
import { createHttpClient } from '../http/createHttpClient'
import { commandOptionNames } from './mappers/commandOptionNames'
import { offlineHttpClient } from './offlineHttpClient'
import { parseCliOptions } from './parseCliOptions'
import type { Command } from './types/Command'
import { usageText } from './usageText'

/**
 * Resolve the command from the first two words, parse its options, build the
 * holder's client and print the command's result as JSON on stdout.
 */
export const runCli = async (
  argv: readonly string[],
  commands: readonly Command[],
  write: (text: string) => void,
): Promise<number> => {
  const exitUsage = 2
  const [portal, action] = argv
  const command = commands.find(
    (candidate) => candidate.portal === portal && candidate.action === action,
  )
  if (!command || argv.includes('--help')) {
    write(usageText(commands) + '\n')
    return command ? 0 : exitUsage
  }
  const options = parseCliOptions(argv.slice(2), commandOptionNames(command))
  if (command.needsCertificate === false) {
    const offline = await command.run(offlineHttpClient, options)
    write(JSON.stringify(offline, null, 2) + '\n')
    return 0
  }
  const identity =
    command.login === 'password'
      ? undefined
      : await loadCertificateIdentity({
          cert: options['cert'],
          key: options['key'],
        })
  const result = await command.run(
    createHttpClient(identity),
    options,
    identity,
  )
  write(JSON.stringify(result, null, 2) + '\n')
  return 0
}
