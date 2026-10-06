/**
 * The value after `Trámite:` or `Procedimiento:` in the page text, up to the
 * next label. Labels end in a colon, so a value may itself contain
 * "Procedimiento" (GZ70 - Procedimiento sancionador...); the field captions
 * without one ("Datos del...", "Expediente/Referencia") also end a value.
 * The text is `htmlToText` output, whose whitespace is single spaces.
 */
export const readLabeledValue = (
  text: string,
  label: 'Trámite' | 'Procedimiento',
): string | undefined =>
  [
    ...text.matchAll(
      /(Trámite|Procedimiento): (.+?)(?= (?:(?:Procedimiento|CSV|NCC asociado|Expediente \/ Referencia|Asunto|Tel[eé]fono):|Expediente\/Referencia|Datos del|Relaci[oó]n de)|$)/g,
    ),
  ]
    .find((match) => match[1] === label)?.[2]
    ?.trim()
