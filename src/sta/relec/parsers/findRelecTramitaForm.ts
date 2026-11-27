import { staOrigins } from '../../session/staOrigins'
import type { RelecCatalogueTag } from '../types/RelecCatalogueTag'

/** Identify the form whose POST action is the exact signing endpoint. */
export const findRelecTramitaForm = (
  tags: readonly RelecCatalogueTag[],
  pageUrl: string,
): RelecCatalogueTag => {
  const expected = `${staOrigins.caceres}/sta/Relec/TramitaSign`
  if (new URL('TramitaSign', pageUrl).href !== expected)
    throw new Error('TramitaForm answered outside the Cáceres signing flow')
  const base = tags
    .find(({ name, attributes }) => name === 'base' && attributes.has('href'))
    ?.attributes.get('href')
  const actionBase = URL.parse(base ?? '', pageUrl)?.href ?? pageUrl
  const matches = tags.filter(({ name, closing, attributes }) => {
    if (
      name !== 'form' ||
      closing ||
      attributes.get('method')?.toLowerCase() !== 'post'
    )
      return false
    const action = attributes.get('action')
    return action ? URL.parse(action, actionBase)?.href === expected : false
  })
  const form = matches[0]
  if (!form || matches.length !== 1)
    throw new Error(
      'TramitaForm carried no unambiguous TramitaSign form; nothing was prepared',
    )
  return form
}
