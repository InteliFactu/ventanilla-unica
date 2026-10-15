import { unescapeHtml } from '../../../html/unescapeHtml'
import type { RayuelaChildChoice } from '../types/RayuelaChildChoice'
/** The navigation lists only the other children, never the current pupil. */
export const parseRayuelaChildrenChoices = (
  html: string,
): RayuelaChildChoice[] =>
  Array.from(
    html.matchAll(
      /new\s+PopUp\(\s*'X_ALUMNO_(\d+)'\s*,\s*'((?:\\.|[^'\\])*)'\s*,\s*'\d+'\s*,\s*cambioHijo\s*\)/g,
    ),
    (match) => ({
      id: match[1] ?? '',
      name: unescapeHtml((match[2] ?? '').replaceAll(/\\(['\\])/g, '$1')),
    }),
  )
