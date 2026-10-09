/**
 * A synthetic "FIRMA DE SOLICITUD" page as TramitaSign answers it: the
 * TramitaJustif form and the `firmar()` lines naming the form XML, the
 * session in the download id and the literal upload id
 * (`hex("justif"):hex(session):hex(procedure)`), session `ABCDEF0123`.
 */
export const relecSignPageHtml = `<html><head><script>
		function firmar()
		{
     		var fichero = "6269000000002829307935Form.xml";
			var inFileId = encodeHex("recoverParaFirma") + ":" + encodeHex("firmar") + ":" + encodeHex("ABCDEF0123") + ":" + encodeHex(escape(fichero));
			var outFileId = '6a7573746966:41424344454630313233:36323639303030303030303032383239333037393335';
			var ficheroName = 'formulario_tramite.xml';
		}
</script></head><body>
<h1>FIRMA DE SOLICITUD</h1>
<form action="TramitaJustif" method="post" id="formulario">
<input type="hidden" id="dboidSolicitud" name="dboidSolicitud" value="6269000000002829307935">
<input type="hidden" name="showApplet" id="showApplet" value="false">
<input type="hidden" id="tarjetacode" name="tarjetacode">
<input type="hidden" name="url" id="url" value="https://sede.caceres.es:443/sta/Relec/TramitaForm?dboidSolicitud=6269000000002829307935&amp;frame=true">
<input type="hidden" name="navigatorMode" id="navigatorMode" value="desktop">
<input type="hidden" id="xmlFirmar" name="xmlFirmar" value="">
</form></body></html>`
