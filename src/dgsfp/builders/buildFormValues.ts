import type { DgsfpFieldValue } from '../types/DgsfpFieldValue'
import type { DgsfpFormValues } from '../types/DgsfpFormValues'
import type { DgsfpHolder } from '../types/DgsfpHolder'
import type { DgsfpProcedureForm } from '../types/DgsfpProcedureForm'
import { initialFieldValue } from './initialFieldValue'

/**
 * The filled form: every control at its loaded state, then the answers by
 * control name. An answer for a control the form lacks is refused, so a
 * changed form fails loudly instead of filing without a field.
 */
export const buildFormValues = (
  form: DgsfpProcedureForm,
  holder: DgsfpHolder,
  answers: Readonly<Record<string, Partial<DgsfpFieldValue>>>,
): DgsfpFormValues => {
  const used = new Set<string>()
  const secciones = form.sections.map((section) => ({
    lineasSeccion: section.lineasSeccion.map((line) => ({
      campos: line.controles.map((control) => {
        if (control === null) return null
        const answer = answers[control.nombre]
        if (answer !== undefined) used.add(control.nombre)
        return { ...initialFieldValue(control, holder), ...answer }
      }),
    })),
    visible: true,
    nombre: section.nombre,
  }))
  const missing = Object.keys(answers).filter((name) => !used.has(name))
  if (missing.length > 0)
    throw new Error(`DGSFP: the form has no field ${missing.join(', ')}`)
  return { tituloFormulario: form.titulo, secciones }
}
