import type { CarpetaFixtureRow } from './CarpetaFixtureRow'

/** The notification rich-table of form `f`, shaped like the sede's (2026-10-06), with invented rows. */
export const carpetaRowsTable = (
  rows: readonly CarpetaFixtureRow[],
  offset = 0,
): string => {
  const cells = rows.map((row, index) => {
    const prefix = `f:tablaNotificaciones:${String(offset + index)}`
    const link = row.link
      ? `<a href="#" title="Acceder" onclick="if(typeof jsfcljs == 'function'){jsfcljs(document.getElementById('f'),{'${prefix}:${row.link}':'${prefix}:${row.link}'},'');}return false"><img src="/SEDE/imagenes/document.png" alt="Ver notificacion" /></a>`
      : ''
    return `<tr class="rich-table-row "><td><span id="${prefix}:numExpediente"></span></td><td><span id="${prefix}:nomProcedimiento">Tramite de prueba</span></td><td><span id="${prefix}:numNotificacion">${row.number}</span></td><td><span id="${prefix}:concepto">Asunto de prueba</span></td><td><span>01/02/2026</span></td><td><span id="${prefix}:estadoNotificacion">${row.status}</span></td><td>${link}</td></tr>`
  })
  return `<table class="rich-table marcoRichTable" id="f:tablaNotificaciones"><tbody>${cells.join('')}</tbody></table>`
}
