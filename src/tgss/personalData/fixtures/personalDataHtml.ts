/**
 * A synthetic Importass "Tus datos personales" page with the structure the
 * portal emits: a relative `<base>`, the three cards and the hidden contact and
 * domicile modals. Every value is invented.
 */
export const personalDataHtml = (
  mobile = '600111222',
  email = 'persona@example.org',
): string => `<html><head><base href="/wps/myportal/importass/importass/tramites/datospersonales/inicio/!ut/p/z1/AAA/"></head><body>
<section id="tarjeta-datos-personales"><dl>
<dt>Nombre</dt><dd> Persona Ejemplo Prueba </dd>
<dt>Fecha de nacimiento</dt><dd>1 de enero de 2000</dd>
<dt> DNI </dt><dd>00000000T</dd></dl>
<dl><dt>Tu número de la Seg. Social</dt><dd>280000000000 </dd></dl></section>
<section id="tarjeta-datos-domicilio" class="ss-content"><dl><dt>Dirección</dt><dd>
<p>Cl. MAYOR 5, piso 2, pta. B</p><p class="x">28001, MADRID</p></dd></dl></section>
<div id="modal-contacto"><form action="p0/IZ7_X=CZ6_Y=LAcontacto=/#Z7_X" method="post">
<input name="telefonoFijo" value="" data-valor=""><input name="prefijo" value="+34">
<input name="telefonoMovil" value="${mobile}"><input name="email" type="email" value="${email}">
<button type="submit" value="ACC_GUARDAR_DATOS_CONTACTO" name="accion">Guardar</button></form></div>
<div id="modal-domicilio"><form action="p0/IZ7_X=CZ6_Y=LAdomicilio=/#Z7_X" method="post">
<select id="pais" name="pais" data-valor="724"><option value="724">España</option></select>
<select id="tipoVia" title="Tipos" name="tipoVia" data-valor="CL"><option value="CL">Calle</option></select>
<input name="nombreVia" value="MAYOR"><input name="numero" value="5"><input name="bis" value="">
<input name="bloque" value=""><input name="escalera" value=""><input name="piso" value="2">
<input name="puerta" value="B"><input name="codigoPostal" value="28001"><input name="localidad" value="MADRID">
<button type="submit" value="ACC_GUARDAR_DOMICILIO" name="accion">Guardar</button></form></div>
</body></html>`
