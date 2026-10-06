/** A synthetic step-1 registry form: invented NIFs, names and references, the portal's structure. */
export const filingFormPage = (attachedKeys = ''): string => `
<h1>Registro Telemático</h1>
<div id='idDivAlertas' class='AEAT_bloque_errores bloque oculto ' ></div>
<form id='Form' method='post' action="https://www1.agenciatributaria.gob.es/wlpl/REGD-JDIT/FGGraba">
<input type='hidden' id='pAccion' name='pAccion' value='' />
<input type='hidden' id='fTramite' name='fTramite' value='XX706' />
<input type='hidden' id='fNCC' name='fNCC' value='1111222233334' />
<input type='hidden' id='fOficinaGestoraNCC' name='fOficinaGestoraNCC' value='G00000' />
<input type='hidden' id='fUnidadTrabajoNCC' name='fUnidadTrabajoNCC' value='' />
<input type='hidden' id='fNifTitular' name='fNifTitular' value='E00000000' />
<input type='hidden' id='fCarpetaGN' name='fCarpetaGN' value='RSAC0000' />
<input type='hidden' id='fCSV' name='fCSV' value='ABCDEFGH12345678' />
<input type='hidden' id='fNif' name='fNif' value='00000000T' />
<input type='hidden' id='fFichero' name='fFichero' value='' />
<li><strong class='azul'>Trámite:</strong>&nbsp;<span>XX706 - Contestar requerimientos, efectuar alegaciones y/o aportar documentos o justificantes</span></li>
<li><strong class='azul'>Procedimiento:</strong>&nbsp;<span>XX70 - Procedimiento sancionador de prueba</span></li>
<li><strong class='azul'>CSV:</strong>&nbsp;<span>ABCDEFGH12345678</span></li>
<li><strong class='azul'>NCC asociado:</strong>&nbsp;<span>1111222233334</span></li>
<label for='fExpediente'>Expediente/Referencia</label>
<input type='text' name='fExpediente' id='fExpediente' value='2026RSC00000000XX' readonly='readonly' />
<label for='fAsunto'>Asunto</label>
<input type='text' name='fAsunto' id='fAsunto' value='' />
<h2>Datos del Interesado</h2><strong>NIF:</strong>&nbsp;<span>00000000T</span><strong>Nombre / Razón Social:</strong>&nbsp;<span>PEREZ PEREZ JUAN</span>
<h2>Datos del Representante</h2><strong>NIF:</strong>&nbsp;<span>99999999R</span><strong>Nombre / Razón Social:</strong>&nbsp;<span>GOMEZ GOMEZ ANA</span>
<h2>Datos del Titular</h2><strong>NIF:</strong>&nbsp;<span>E00000000</span><strong>Nombre / Razón Social:</strong>&nbsp;<span>EJEMPLO ESPJ</span>
<h2>Datos de contacto</h2>
<input type='button' id='btnFirmar' name='btnFirmar' value='Firmar y Enviar' />
<textarea  id='fTexto'  name='fTexto' rows='10'></textarea>
</form>
<form id='Form2' method='post' action="https://www1.agenciatributaria.gob.es/wlpl/REGD-JDIT/FG">
<input type='hidden' id='pAccionForm2' name='pAccionForm2' value='2' />
<input type='hidden' id='fclavesAODITForm2' name='fclavesAODITForm2' value='${attachedKeys}' />
<input type='hidden' id='fCSVAvanzar' name='fCSVAvanzar' value='' />
</form>`
