/**
 * The "3. Descargar justificante" page TramitaJustif answered on 2026-10-02,
 * trimmed to what is read, with an invented CSV, hash and NIF.
 */
export const relecResultHtml = `<html><head><title>3. Descargar justificante</title></head><body>
<script>
	var serverdate = new Date(1790952323387);
	var offsetServer = 2;
</script>
<h1>SU SOLICITUD HA SIDO PROCESADA CORRECTAMENTE</h1>
		<iframe id="iframeJustif" alt="Result" src="../Utils/DocumentCheck?ACTION=view&amp;CUD=11112222333344445555&amp;NIF=B1234567" style="width:100%;height:37.500em;"></iframe><br>
	<script>
	var docu="Le adjuntamos el justificante de su solicitud. : " + "https://sede.caceres.es:443/sta/docs/GetDocumentServlet?CUD=11112222333344445555%26HASH_CUD=0000000000000000000000000000000000000000";
	</script>
	<div class="col-dcha"><a class="boton-style tamano-defecto naranja" href="../Utils/DocumentCheck?ACTION=view&amp;CUD=11112222333344445555&amp;NIF=B1234567&amp;method=download&amp;name=APORTACION" target="_blank">Descargar justificante</a></div>
</body></html>`
