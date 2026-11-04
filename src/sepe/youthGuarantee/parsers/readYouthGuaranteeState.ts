/** Only literal state labels count; an unrecognized page remains unknown. */
export const readYouthGuaranteeState = (
  text: string,
): 'alta' | 'baja' | 'pendiente' | undefined => {
  const state =
    /Estado(?: de (?:la )?(?:inscripci[oó]n|solicitud))?(?: :|:)? (alta|baja|pendiente)\b/i
      .exec(text)?.[1]
      ?.toLowerCase()
  return state === 'alta' || state === 'baja' || state === 'pendiente'
    ? state
    : undefined
}
