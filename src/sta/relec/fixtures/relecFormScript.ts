/**
 * The script part of a synthetic TramitaForm page: the address blocks of
 * `changeDireccion()`, the `direcciones` options with one selected, and the
 * `changeRepresentado()` contact prefill and represented block, shaped as
 * the Cáceres sede emitted them on 2026-10-09 with invented values.
 */
export const relecFormScript = `<script>
function changeDireccion(combo,modo){
	<!-- PERSONA INTERESADA -->
			if(codigoDireccion=='1009000000000000000001')
			{
				acronimo="CALLE";
				document.getElementById(modo+"tipoVia").disabled=true;
				document.getElementById(modo+"pais").value='ESPAÑA';
				document.getElementById(modo+"provincia").value='CACERES';
				document.getElementById(modo+"codigopostal").value='10001';
				document.getElementById(modo+"municipio").value="CACERES";
				document.getElementById(modo+"calle").value=htmlDecode("MAYOR &amp; SOL");
					document.getElementById(modo+"kmcalleText").value='7';
					document.getElementById(modo+"kmcalle").value='7';
					document.getElementById(modo+"indKmCode").value='NUM';
				document.getElementById(modo+"bloque").value=' ';
			}
			if(codigoDireccion=='1009000000000000000002')
			{
				acronimo="AVDA";
				document.getElementById(modo+"calle").value=htmlDecode("OTRA");
			}
}
function loadAddressFrom(tipo,modo){
	document.getElementById("direcciones"+modo).options[1].value="1009000000000000000001";
	document.getElementById("direcciones"+modo).options[1].selected=true;
	document.getElementById("direcciones"+modo).options[2].value="1009000000000000000002";
}
function changeRepresentado(combo){
		$("contact1").value="600000000";
		$("contact21").value="ana@example.es";
				if(codigoRepresentado=='2000400050000000000001NEW' || codigoRepresentado=='2000400050000000000001')
				{
						$("RepRazonSoc").value='EJEMPLO SL';
						$("RepCIF").value='B1234567';
						$("RepCIFCtrlDigit").value='8';
						$("RepAcronym").value='ES';
						setCheckedValue(document.forms[0].elements['tipoPersonaRepresented'],"RJ");
					$('SELECTED_PERSON').value = '2000400050000000000001';
				}
}
</script>`
