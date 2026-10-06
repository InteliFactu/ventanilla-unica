/** A synthetic "Firmar y Enviar" window for envío ID1 showing `header`. */
export const tgviSignatureDialog = (header: string): string => `
<input type='button' disabled name='Firmar' id='bFirmar'
  onclick='presentarAjax("ID1", "00000000T", "PRUEBA PRUEBA PEPE");'/>
<textarea rows='4' cols='137' readonly="readonly" class="firma">${header}</textarea>`
