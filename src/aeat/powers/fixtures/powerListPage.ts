import { powerColumnLabels } from './powerColumnLabels'

/** A synthetic ITTI-APOD granted-powers page with the given `filaNum` rows (cell texts), shaped like the portal's. */
export const powerListPage = (
  holder: string,
  rows: readonly (readonly string[])[],
): string => {
  const columns = powerColumnLabels
    .map(
      (label, index) =>
        `<label for='CKBcolumna_n${String(index + 1)}'><input type='checkbox' class='checkColumna' id='CKBcolumna_n${String(index + 1)}' checked />${label}</label>`,
    )
    .join('')
  const body =
    rows.length === 0
      ? "<strong class='texto_cen'>No se han obtenido resultados para estos datos</strong>"
      : `<table><tbody id='tbodyDatos'>${rows
          .map(
            (cells, index) =>
              `<tr  id='filaNum${String(index)}' class='fila_par' >${cells.map((cell) => `<td scope='row'><span>${cell}</span></td>`).join('')}</tr>`,
          )
          .join('')}</tbody></table>`
  return `<h1>Consulta, pr&oacute;rroga y revocaci&oacute;n de apoderamientos otorgados</h1><ul><li><strong>Poderdante = :</strong>&nbsp;${holder} - TEST HOLDER SL</li><li><strong>Apoderado =</strong></li></ul>${columns}${body}`
}
