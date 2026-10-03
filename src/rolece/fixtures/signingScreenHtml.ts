import { escapeTestAttribute } from './escapeTestAttribute'

/**
 * A synthetic "pendiente de ser firmada" screen: the AutoFirma call of the
 * real page, word for word, the onload token and the `firmaSolicitud` form.
 */
export const signingScreenHtml = (document: string, nif: string): string =>
  String.raw`<script>function firmaExito(signatureB64, certificateB64){
document.getElementById("xmlFirmado").value=decode64(signatureB64);
document.getElementById("firma").value = signatureB64;}
function firmaXADESEnvelopedXML(){
var params = "format=XAdES Enveloped\nmode=implicit\naddKeyInfoKeyName=true\nignoreStyleSheets=false\nfilter=signingCert\nnodeToSign=root";
AutoScript.sign(
encode64(document.getElementById("campoXML").value),
"SHA256withRSA",
"XADES",
params, firmaExito, firmaError);}
function body_load(){ document.getElementById("token").value = "onload-token"; }</script>` +
  `<h1>Solicitud de Inscripción en el Registro pendiente de ser firmada</h1><form id="firmaSolicitud" name="firmaSolicitud" action="/rolece/comun/firmaSolicitud.action" method="post"><input type="hidden" name="campoXML" value="${escapeTestAttribute(document)}" id="campoXML"/><input type="hidden" id="token" name="token" value="served-token" /><input type="hidden" id="firma" name="firma" /><input type="hidden" name="xmlFirmado" value="" id="xmlFirmado"/><input type="hidden" name="numDocumento" value="${nif}"/><input type="hidden" name="provinciaSimpli" value="ES432"/><input type="submit" value="Volver" name="method:volverSimpliciada"/><button type="button" id="botonFirma" onclick="preparaFormulario('firmaSolicitud','/comun/firmaSolicitud!firmarSolicitud');return firmaXADESEnvelopedXML();">Firmar</button></form>`
