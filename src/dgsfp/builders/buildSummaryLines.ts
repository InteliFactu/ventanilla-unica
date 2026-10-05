import { fieldValueLines } from '../mappers/fieldValueLines'
import type { DgsfpFormValues } from '../types/DgsfpFormValues'
import type { DgsfpSummaryLine } from '../types/DgsfpSummaryLine'

/**
 * The request document's body as the page lays it out: the form title, then
 * every visible section with its visible fields that are not excluded from
 * the final report, then the "HUELLA" card with the server's HMAC.
 */
export const buildSummaryLines = (
  values: DgsfpFormValues,
  hmac: string,
): readonly DgsfpSummaryLine[] => {
  const yesNo = (value: string): string => (value === 'true' ? ' Sí' : ' No')
  const sections = values.secciones
    .filter((section) => section.visible)
    .flatMap((section): DgsfpSummaryLine[] => [
      { text: section.nombre, style: 'section' },
      ...section.lineasSeccion
        .flatMap((line) => line.campos)
        .filter((field) => field !== null)
        .filter((field) => field.visible && !field.ocultarInformeFinal)
        .flatMap((field): DgsfpSummaryLine[] => [
          {
            text: `${field.etiqueta || field.nombre}:${field.tipo === 'DatosControlSiNo' ? yesNo(field.value) : ''}`,
            style: 'label',
          },
          ...fieldValueLines(field).map((text): DgsfpSummaryLine => ({
            text,
            style: 'value',
          })),
        ]),
    ])
  return [
    { text: values.tituloFormulario, style: 'title' },
    ...sections,
    { text: 'HUELLA', style: 'section' },
    { text: hmac, style: 'value' },
  ]
}
