import { accountPaymentFixture } from './accountPaymentFixture'

/** The blank LiquidacionesCuenta form, reduced to its controls, for an invented holder. */
export const accountPaymentFormHtml = `
<ul><li><input type='hidden' id='nifCert' name='nifCert' value='${accountPaymentFixture.nif}'/></li>
<li><input type='hidden' id='nomCert' name='nomCert' value='${accountPaymentFixture.nombre}'/></li></ul>
<form id='idfmPRINCIPAL' target="_self" action="/wlpl/OVPP-PAGO/LiquidacionesCuenta" method='POST' class="fondo_blanco">
<input type='hidden' id='idcodOpe' name='idcodOpe' value='002'/>
<input type='hidden' id='extraInfo' name='extraInfo' value=''/>
<input type='hidden' id='idres' name='idres' value=""/>
<input type='hidden' id='mov' name='mov' value='01'/>
<input type='hidden' id='param' name='param' value=''/>
<input type='hidden' id='opeori' name='opeori' value=''/>
<input type='hidden' id='rin' name='rin' value=''/>
<input type='hidden' id='fAccion' name='fAccion' value='1'/>
<select id='idmod' name='idmod' required><option value='010' >010 - Documento de ingreso parcial o fuera de plazo.</option></select>
<input type='text' name='idjus' id='idjus' value='' maxlength='13' size='13' required />
<input type='text' name='idnif' id='idnif' value='' maxlength='9' size='9' required />
<input type='text' name='idape' id='idape' value="" maxlength='40' size='40' required />
<input type='hidden' id='idimpOculto' name='idimpOculto' value='' />
<input type='text' name='idimp' id='idimp' value='0,00' maxlength='16' size='16' required />
<input type='checkbox' id='checkIban' name='checkIban'>
<input type="hidden" id="ibanUsado" name="ibanUsado" value="ES7921000000000000000000"/>
<input type="text" name="idiban" id="idiban" maxlength='28' size='24' value="" required/>
<input type="checkbox" name="idAPO" id="idAPO">
<input type='hidden' id='apoBloq' name='apoBloq' value='0'/>
<input type='button' id='CONF' name='CONF' class='AEAT_boton' value='Aceptar datos y Continuar' onclick="idfmPRINCIPAL.submit();"/>
</form>`
