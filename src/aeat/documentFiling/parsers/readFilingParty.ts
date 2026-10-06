import type { FilingParty } from '../types/FilingParty'

/** The NIF and name the registry prints under "Datos del <role>", from the page text. */
export const readFilingParty = (
  text: string,
  role: 'Interesado' | 'Representante' | 'Titular',
): FilingParty | undefined => {
  const party = [
    ...text.matchAll(
      /Datos del (Interesado|Representante|Titular) NIF: (\S+) Nombre \/ Raz[oó]n Social: (.+?)(?= Datos d| Relaci[oó]n de| Documentaci[oó]n|$)/g,
    ),
  ].find((match) => match[1] === role)
  if (!party?.[2] || !party[3]) return undefined
  return { nif: party[2], nombre: party[3].trim() }
}
