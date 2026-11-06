import { accountPaymentFixture } from './accountPaymentFixture'

/** The summary page (fAccion=4) the first step answers, for an invented payment. */
export const accountPaymentSummaryHtml = `
<form id="idfmPRINCIPAL" method="POST" target="_self" action="/wlpl/OVPP-PAGO/LiquidacionesCuenta" class="fondo_blanco">
<input type='hidden' id='idcodOpe' name='idcodOpe' value='002'/>
<input type='hidden' id='mov' name='mov' value='01'/>
<input type='hidden' id='param' name='param' value='true'/>
<input type='hidden' id='fAccion' name='fAccion' value='4'/>
<input type='hidden' id='idmod' name='idmod' value='${accountPaymentFixture.modelo}'/>
<input type='hidden' id='idjus' name='idjus' value='${accountPaymentFixture.justificante}'/>
<input type='hidden' id='idnif' name='idnif' value='${accountPaymentFixture.nif}'/>
<input type='hidden' id='idape' name='idape' value="${accountPaymentFixture.nombre}"/>
<input type='hidden' id='idNifNom' name='idNifNom' value="${accountPaymentFixture.nif} - ${accountPaymentFixture.nombre}"/>
<input type='hidden' id='idimp' name='idimp' value='${accountPaymentFixture.importe}'/>
<input type='hidden' id='idiban' name='idiban' value='${accountPaymentFixture.iban}'/>
<input type='hidden' id='idAPO' name='idAPO' value='0'/>
<input type='hidden' id='apoBloq' name='apoBloq' value='0'/>
<input type='hidden' id='idimpOculto' name='idimpOculto' value='' />
<b>Para finalizar el proceso, marque "Conforme" y pulse en "Firmar y Enviar":</b>
<input type='checkbox' id='check' name='conforme' onclick='javascript:jsDisabledBoton("check","CONF");'/>
<input type='submit' id='CONF' name='CONF' class='AEAT_boton' value='Firmar y Enviar' disabled onclick='jsSendDisabled();'/>
<input type='button' id='CANCEL' name='CANCEL' class='AEAT_boton' value='Volver' />
</form>`
