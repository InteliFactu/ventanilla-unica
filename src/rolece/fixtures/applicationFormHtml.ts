/**
 * A synthetic `inscripcionPersonaF` screen with the hidden fields the portal
 * carries and, optionally, extra markup (selects, text inputs, buttons).
 */
export const applicationFormHtml = (
  fields: Readonly<Record<string, string>>,
  extra = '',
): string =>
  `<form id="inscripcionPersonaF" name="inscripcionPersonaF" action="/rolece/comun/inscripcionPersonaF.action" method="post">${Object.entries(
    fields,
  )
    .map(
      ([name, value]) =>
        `<input type="hidden" name="${name}" value="${value}" id="${name}"/>`,
    )
    .join('')}${extra}</form>`
