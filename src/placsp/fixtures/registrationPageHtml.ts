/** A synthetic PLACSP self-registration page, with the availability messages it answers. */
export const registrationPageHtml = (
  messages: {
    readonly user?: string
    readonly email?: string
    readonly free?: string
  } = {},
): string =>
  `<form id="viewns_Z7_TEST_:form1" method="post" action="/wps/portal/registrarse/!ut/p/z1/x/">
<input type="hidden" name="javax.faces.encodedURL" value="/wps/portal/registrarse/x" />
<input id="viewns_Z7_TEST_:form1:idUsu" name="viewns_Z7_TEST_:form1:idUsu" type="text" value="" /><span id="viewns_Z7_TEST_:form1:message24" class="message">${messages.user ?? ''}</span>
<input id="viewns_Z7_TEST_:form1:idEmail" name="viewns_Z7_TEST_:form1:idEmail" type="text" value="" /><span id="viewns_Z7_TEST_:form1:message248">${messages.email ?? ''}</span>
<input type="submit" value="LIMPIAR" name="viewns_Z7_TEST_:form1:button03_3" />
<input type="submit" value="COMPROBAR DISPONIBILIDAD" name="viewns_Z7_TEST_:form1:buttonComprobarDisponibilidad" />
<input type="password" name="viewns_Z7_TEST_:form1:secret1" value="" />
<input id="viewns_Z7_TEST_:form1:idContrasenyaReal" name="viewns_Z7_TEST_:form1:idContrasenyaReal" type="text" value="" />
<input type="hidden" name="viewns_Z7_TEST_:form1_SUBMIT" value="1" />
<input type="hidden" name="javax.faces.ViewState" value="state" />
${messages.free === undefined ? '' : `<span id="viewns_Z7_TEST_:form1:idMsjHiddenIdLibre" class="tipoVerdeCursiva">${messages.free}</span>`}
</form>`
