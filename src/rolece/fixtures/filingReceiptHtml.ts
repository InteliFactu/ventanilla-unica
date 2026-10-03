/**
 * A synthetic acuse de recibo, shaped like the one ROLECE answered on
 * 2026-10-03: the registry and expediente numbers, and the
 * `descargarJustificante` form with a commented-out Imprimir button.
 */
export const filingReceiptHtml = `<div id="menu">Inicio</div><div id="content"><h1>Justificante de Presentación de la Solicitud de Inscripción en el Registro</h1><p>ACUSE DE RECIBO DE LA SOLICITUD DE INSCRIPCI&Oacute;N EN EL REGISTRO</p><td><b>N&uacute;mero de Registro :	ROLECE2026E000000001</b></td><td>N&uacute;mero de Expediente :
</td><td><b>2026\\000123</b></td><form id="descargarJustificante" name="descargarJustificante" action="/rolece/comun/descargarJustificante.action" method="post"><!-- <input type="submit" value="Imprimir" name="button.text.imprimir"/> --><input type="hidden" name="campoXML" value="&lt;p&gt;Secretar&iacute;a&lt;/p&gt;"/><input type="submit" value="Ver Justificante" name="method:verJustificante"/><input type="submit" value="Descargar el Justificante Electr&oacute;nico" name="method:descargaJustificante"/></form></div>`
