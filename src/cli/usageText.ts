import { commandEffectTag } from './mappers/commandEffectTag'
import { commandLabelWidth } from './mappers/commandLabelWidth'
import { commandOptionNames } from './mappers/commandOptionNames'
import type { Command } from './types/Command'

/** The help text: one line per command plus the global options. */
export const usageText = (commands: readonly Command[]): string =>
  [
    'ventanilla-unica - client for the Spanish public administration portals, with your own certificate',
    '',
    'usage: ventanilla-unica <portal> <action> [--cert cert.pem --key key.pem] [--out dir] [options]',
    '',
    ...commands.map(
      (command) =>
        `  ${command.portal} ${command.action}`.padEnd(
          commandLabelWidth(commands),
        ) +
        command.description +
        commandEffectTag(command) +
        (commandOptionNames(command).length > 0
          ? ` (${commandOptionNames(command)
              .map((option) => `--${option}`)
              .join(', ')})`
          : ''),
    ),
    '',
    'The certificate and key are PEM files, also read from VENTANILLA_UNICA_CERT and VENTANILLA_UNICA_KEY.',
    'Reads are the default. A [WRITE] command only prepares and prints its plan unless --confirmar si is given.',
  ].join('\n')
