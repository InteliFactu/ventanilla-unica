/** An auto-post SAML relay form, as the sede's IdP hops carry it. */
export const registradoresSamlForm = (action: string, field: string): string =>
  `<form method="post" action="${action}"><input type="hidden" name="${field}" value="x"/><input type="hidden" name="RelayState" value="r"/></form>`
