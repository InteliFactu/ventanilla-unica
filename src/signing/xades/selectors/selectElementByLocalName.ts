import { selectElementPath } from '../../xml/selectors/selectElementPath'
import type { XmlElement } from '../../xml/types/XmlElement'

/** The path to the first element named `local` under any prefix, refusing a document without one. */
export const selectElementByLocalName = (
  root: XmlElement,
  local: string,
): readonly XmlElement[] => {
  const path = selectElementPath(
    root,
    (element) => element.name === local || element.name.endsWith(`:${local}`),
  )
  if (path === undefined) throw new Error(`the signature has no ${local}`)
  return path
}
