/**
 * A synthetic `firmarAcuseRecibo.jsf`: form `form` with the acuse fields,
 * the "Firmar documento" button that only opens the modal (same image as the
 * real accept button, which is why the selector looks inside the panel),
 * and the `panelAceptar1` modal holding the real "Aceptar".
 */
export const carpetaAcceptPage = `<html><body>
<form id="form" name="form" method="post" action="/SEDE/privado/ciudadanos/firmarAcuseRecibo.jsf">
<input type="hidden" name="form" value="form" />
<input id="form:estado" type="text" name="form:estado" value="Pendiente" readonly="readonly" />
<input id="form:j_id5" name="form:j_id5" alt="Firmar documento Asunto de prueba" type="image" src="/SEDE/imagenes/bt_aceptar.gif" />
<input type="image" src="/SEDE/imagenes/bt_atras.gif" name="form:j_id6" alt="Volver" />
<input id="form:firma" type="hidden" name="form:firma" />
<input id="form:hash" type="hidden" name="form:hash" value="JVBERi0=" />
<span id="form:panelAceptar"><div id="form:panelAceptar1" style="display: none;">
<input autocomplete="off" id="form:panelAceptar1OpenedState" name="form:panelAceptar1OpenedState" type="hidden" />
<span>Va a proceder a aceptar la notificaci&oacute;n.</span>
<input class="puntero" id="form:j_id7" name="form:j_id7" alt="Aceptar" type="image" src="/SEDE/imagenes/bt_aceptar.gif" />
<input type="image" src="/SEDE/imagenes/bt_cancelar.gif" name="form:j_id8" alt="Cancelar" />
</div><div class="rich-mpnl-resizer" id="form:panelAceptar1ResizerN"></div></span>
<input type="hidden" name="javax.faces.ViewState" value="state-2" />
</form></body></html>`
