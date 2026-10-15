import type { RelecVariable } from '../types/RelecVariable'

/** The "Solicito" fields of a Relec form: every `DinTit<name>` input names a `DinVar<name>` field and carries its label. */
export const parseRelecVariables = (
  fields: Readonly<Record<string, string>>,
): readonly RelecVariable[] =>
  Object.entries(fields).flatMap(([key, label]) =>
    key.startsWith('DinTit')
      ? [{ name: key.slice('DinTit'.length), label: label.replace(/:$/, '') }]
      : [],
  )
