/** A synthetic step-2 "Firma y Envío" screen listing the given file names and, when given, the interesado. */
export const signatureScreenPage = (
  names: readonly string[],
  interesado?: string,
): string => `
<title>Registro Telemático - Firma y Envío de la solicitud</title>
${interesado === undefined ? '' : `<h2>Datos del Interesado</h2><strong>NIF:</strong>&nbsp;<span>${interesado}</span><strong>Nombre / Razón Social:</strong>&nbsp;<span>LOPEZ LOPEZ LUIS</span>`}
<script>
  var _fbNombre="GOMEZ GOMEZ ANA";
  var _fbNif="99999999R";
</script>
<form id='Form' method='post' action="https://www1.agenciatributaria.gob.es/wlpl/REGD-JDIT/FG">
<input type='hidden' id='pAccion' name='pAccion' value='3' />
<input type='hidden' id='fFicherosTotales' name='fFicherosTotales' value='${names.map((name, index) => `${name}@DESC@200@K${String(index)}@HASH@0`).join('@')}' />
<input type='hidden' id ='FIRNIF' name='FIRNIF' value='' />
<input type='hidden' id ='FIRNOMBRE' name='FIRNOMBRE' value='' />
<input type='hidden' id ='FIR' name='FIR' value='' />
<input class='AEAT_boton' type='button' name='FirmayEnvia_1' id='FirmayEnvia_1' value='Firmar Enviar' />
</form>`
