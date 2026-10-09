import { relecFormScript } from './relecFormScript'

/** A synthetic TramitaForm page: the script, then the TramitaSign form with its hidden and identification inputs. */
export const relecFormHtml = `<html><head>${relecFormScript}</head><body>
<form action="TramitaSign" method="post" id="formulario" name="formulario" onsubmit="lanzar();">
<input type="hidden" name="solicitudname" id="solicitudname" value="APORTACION" />
<input type="hidden" name="solicituddesc" id="solicituddesc" value="Aportaci&oacute;n de documentaci&oacute;n " />
<input type="hidden" name="DBOIDPERS" id="DBOIDPERS" value="2000400000000000000009" />
<input type="hidden" name="dboidRequest" id="dboidRequest" value="6269000000002829307935" />
<input type="hidden" name="book" value="980000000000000000001" />
<input type="hidden" name="regOrg" value="51500000000000000001" />
<input type="hidden" name="subject" value="" />
<input type="hidden" name="pattern" value="REG_TELEMATI" />
<input type="hidden" name="shibbolet" id="shibbolet" value="false" />
<input type="hidden" id="OriginConsent" name="OriginConsent"/>
<input type="hidden" name="url" id="url" value="https://sede.caceres.es:443/sta/Relec/TramitaForm?dboidSolicitud=6269000000002829307935&amp;frame=true" />
<input type="hidden" name="urlBack" id="urlBack" value="+%2Fsta%2FCarpetaPublic%2F"/>
<input type="hidden" id="procDboid" name="procDboid" value="6461000000000000000001"/>
<input id="SELECTED_PERSON" name="SELECTED_PERSON" type="hidden" value="" />
<input type="hidden" name="showApplet" id="showApplet" value="false"/>
<input type="hidden" name="navigatorMode" id="navigatorMode" value="desktop" />
<input type="radio" id="tipoActuacion" name="tipoActuacion" value="R" checked/>
<input type="radio" id="tipoActuacion" name="tipoActuacion" value="RT"/>
<input type="hidden" id="Acronym" name="Acronym" value="ES"/>
<input type="text" id="docuNum" name="docuNum" value="12345678"/>
<input type="text" id="ctrlDigit" name="ctrlDigit" value="Z"/>
<input type="hidden" id="IJAcronym" name="IJAcronym" value="ES"/>
<input type="text" id="IJCIF" name="CIF" value="12345678"/>
<input type="text" id="IJCIFCtrlDigit" name="IJCIFCtrlDigit" value="Z"/>
<input type="text" id="nombre" name="nombre" value="ANA"/>
<input type="text" id="apellido1" name="apellido1" value="LOPEZ"/>
<input type="text" id="apellido2" name="apellido2" value="RUIZ"/>
<select id="representados" name="representados" onchange="javascript:changeRepresentado(this);">
	<option value="2000400050000000000001">
		EJEMPLO SL</option>
</select>
<select id="RepresentadotipoVia" name="RepresentadotipoVia"><option value="ALMDA">ALAMEDA</option><option value="CALLE">CALLE</option></select>
<input type="checkbox" name="lopdok" id="lopdok"/>
</form></body></html>`
