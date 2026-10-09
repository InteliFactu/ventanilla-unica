/** One gate button as the sede renders it (sede.caceres.es, 2026-10-09). */
export const gateButtonHtml = (
  object: string,
  action: string,
  label: string,
): string =>
  `<a href="#" class="responsive ui-btn tamano-defecto " onclick="if (jQuery(this).hasClass('disabled')) {return false;} else {if(validateForm(this)){callWidgetEventExecuteOn('DATOS_PERSONALES', '${object}', '${action}', '', '','');};return false;}" > <span class="a-text">${label}</span> </a>`
