import { htmlToText } from '../../html/htmlToText'
import type { IriaSurvey } from '../types/IriaSurvey'

/**
 * The rows of the survey list (`encuestas.jsf`), which IRIA opens when the
 * account holds more than one survey: the survey name sits in the fourth
 * cell and "Sí" or "No" pending questionnaires in the fifth.
 */
export const parseIriaSurveys = (html: string): IriaSurvey[] =>
  [...html.matchAll(/<tr data-ri="\d+"[^>]*>([\s\S]*?)<\/tr>/gi)].flatMap(
    ([, row]) => {
      const cells = [
        ...(row ?? '').matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi),
      ].map(([, cell]) => htmlToText(cell ?? '').trim())
      const encuesta = cells[3]
      if (!encuesta) return []
      return [{ encuesta, cuestionariosPendientes: cells[4] === 'Sí' }]
    },
  )
