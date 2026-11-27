/** Recognize the empty reply and the serialized form used by the sede. */
export const parseDgsfpDraftPresence = (body: string): boolean => {
  let draft: unknown
  try {
    const encoded = JSON.parse(body) as unknown
    if (encoded === '') return false
    if (typeof encoded === 'string') draft = JSON.parse(encoded) as unknown
  } catch {
    throw new Error('DGSFP: unexpected complaint draft response')
  }

  if (
    typeof draft !== 'object' ||
    draft === null ||
    !('tituloFormulario' in draft) ||
    typeof draft.tituloFormulario !== 'string' ||
    !('secciones' in draft) ||
    !Array.isArray(draft.secciones)
  ) {
    throw new Error('DGSFP: unexpected complaint draft response')
  }
  return true
}
