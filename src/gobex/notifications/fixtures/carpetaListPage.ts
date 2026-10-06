import type { CarpetaFixtureRow } from './CarpetaFixtureRow'
import { carpetaRowsTable } from './carpetaRowsTable'

/**
 * A synthetic `Notificaciones.jsf`: the search form `f` with its "Buscar"
 * button, the grid, and optionally the scroller and the `panelDescargar`
 * modal an accepted notification opens.
 */
export const carpetaListPage = (
  rows: readonly CarpetaFixtureRow[],
  options: { readonly scroller?: boolean; readonly panel?: boolean } = {},
): string =>
  `<html><body><form id="f" name="f" method="post" action="/SEDE/privado/ciudadanos/Notificaciones.jsf">
<input type="hidden" name="f" value="f" />
<input type="image" src="/SEDE/imagenes/bt_buscar.gif" name="f:j_id1" />
<div class="columnas_rejilla"><table><tr><td>N&ordm;. expediente</td><td>Tr&aacute;mite</td><td>N&ordm;. notificaci&oacute;n</td><td>Asunto</td><td>F. notificaci&oacute;n</td><td>Estado</td><td>Acciones</td></tr></table></div>
${carpetaRowsTable(rows)}
${options.scroller ? "<script>new Richfaces.Datascroller('f:paginas', function(event){A4J.AJAX.Submit('f',event,{})});</script>" : ''}
${options.panel ? '<div id="f:panelDescargar"><input id="f:imprimirnot" type="image" src="/SEDE/imagenes/bt_imprimir.gif" name="f:imprimirnot" alt="Imprimir" /><input id="f:imprimiracuse" type="image" src="/SEDE/imagenes/bt_imprimir.gif" name="f:imprimiracuse" alt="Imprimir" /></div>' : ''}
<input type="hidden" name="javax.faces.ViewState" value="state-1" />
</form></body></html>`
