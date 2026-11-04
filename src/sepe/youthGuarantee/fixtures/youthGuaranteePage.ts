/** Synthetic portal structure; no captured holder or session values. */
export const youthGuaranteePage = (step: number): string => {
  const name =
    step === 6 ? 'confirmarInscripcion' : step === 2 ? 'validar' : 'siguiente'
  const declarations = [
    'Estudios',
    'Formacion',
    'Empadronamiento',
    'Responsabilidad',
    'Neet',
  ]
    .map(
      (suffix) =>
        `<label for="${suffix}">${suffix}</label><input type="checkbox" id="${suffix}" name="situacionSolicitante.check${suffix === 'Empadronamiento' || suffix === 'Responsabilidad' || suffix === 'Neet' ? suffix : 'Compromiso' + suffix}N" value="true"><input type="hidden" name="__checkbox_${suffix}" value="true">`,
    )
    .join('')
  const fields =
    step === 1
      ? declarations
      : step === 6
        ? '<label for="lopd">Data protection</label><input id="lopd" type="checkbox" name="checkLOPD" value="true"><input name="__checkbox_checkLOPD" type="hidden" value="true">'
        : '<label for="choice">Choice (*)</label><select id="choice" name="choice" required><option value="A">First option</option><option value="B">Second option</option></select>'
  return `<title>Inscription step ${String(step)}</title><a href="./logout">Salir</a><form name="contSol"><input name="outer" type="hidden" value="not-submitted"><form name="solicitudPaso${String(step)}" action="/solicitudPaso${String(step)}Token.action">
    <input type="hidden" name="struts.token.name" value="token"><input type="hidden" name="token" value="synthetic-${String(step)}">
    ${step === 1 ? '<h1>DECLARACIÓN RESPONSABLE</h1><input name="situacionSolicitante.estadoInscripcion.idEstadoInscripcionC" type="hidden" value="01"><input type="hidden" name="tieneSolicitudConsolidada" value="">' : ''}
    ${step === 2 ? '<input id="confirmaMovil" name="confirmaMovil" type="hidden" value="1"><input id="confirmaCorreo" type="hidden" value="1">' : ''}
    ${fields}<input name="${name}" type="submit" value="${step === 6 ? 'Confirmar solicitud' : 'Siguiente'}"><input name="limpiar" type="submit" value="Limpiar"></form></form>`
}
