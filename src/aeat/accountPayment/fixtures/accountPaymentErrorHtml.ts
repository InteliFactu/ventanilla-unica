/** A step answered with the "Errores detectados" block, as the first step prints a wrong justificante. */
export const accountPaymentErrorHtml = `
<div id="idDivAlertas" class="AEAT_bloque_errores bloque">
<h2>Errores detectados</h2>
<h3>Datos de la liquidación</h3><ul class='lista_espaciada' id='idUlAlertas'><li><span class='raquo'></span>Número de Justificante o importe erróneo o ausente.  Tipo liquidación. Carácter de control 13 inválido para número de justificante [010000000001A]. (<a href='javascript:foco("idjus")'>Ir a error</a>)</li></ul>
<li><span class='raquo'></span>El campo banco tiene un formato erróneo.(<a href='javascript:foco("idlBancosAT")'>Ir a error</a>)</li>
</div>
<form id='idfmPRINCIPAL' action="/wlpl/OVPP-PAGO/LiquidacionesCuenta" method='POST'>
<input type='hidden' id='fAccion' name='fAccion' value='1'/>
</form>`
