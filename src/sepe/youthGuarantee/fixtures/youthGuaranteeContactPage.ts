import { youthGuaranteePage } from './youthGuaranteePage'

/** Synthetic structure matching the step-2 GET form and its JS state flags. */
export const youthGuaranteeContactPage = (
  mobile = '0',
  email = '0',
  token = 'contact-0',
): string =>
  youthGuaranteePage(2)
    .replace('synthetic-2', token)
    .replace(
      'name="confirmaMovil" type="hidden" value="1"',
      `name="confirmaMovil" type="hidden" value="${mobile}"`,
    )
    .replace(
      'id="confirmaCorreo" type="hidden" value="1"',
      `id="confirmaCorreo" type="hidden" value="${email}"`,
    )
    .replace(
      '<input name="validar"',
      `<input id="movilActual" name="movilActual" type="hidden" value="600000000"><input id="correoconfirmacion" type="hidden" value="holder@example.test">
      <input id="movil" name="datosContacto.movilC" type="text" required>
      <input id="correoElectronico" name="datosContacto.correoElectronicoC" type="text" required>
      <input id="correoElectronicoR" name="datosContacto.correoElectronicoCR" type="text" required>
      <select name="datosDireccionDomicilio.tcodProvincia" required><option value="10">Cáceres</option></select>
      <select name="datosDireccionDomicilio.tcodMunicipio" required><option value="0">Seleccione...</option></select>
      <input name="pinSMS" id="pinSMS" type="text">
      <input name="confirmarMovil" type="submit" value="Verificar móvil">
      <input name="confirmarOTP" type="submit" value="Confirmar código">
      <input name="confirmarCorreo" type="submit" value="Verificar correo">
      <input name="refresh" type="submit" value="Ya he verificado">
      <input name="validar"`,
    )
