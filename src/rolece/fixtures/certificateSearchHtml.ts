/** A synthetic "Certificado Ordinario" search answer with one row, shaped like the portal's. */
export const certificateSearchHtml = (nif: string, name: string): string =>
  `<form id="visualizarCertificados" action="/rolece/public/visualizarCertificados.action">
<table id="paginacion" class="cell-border dataTable"><thead><tr><td><strong>Cod. Identificación</strong></td><td><strong>Denominación Social</strong></td><td>Descargar</td><td>Visualizar</td></tr></thead>
<tbody><tr style="background-color: #F0F0F0;">
<td>
 ${nif}
</td>
<td>
 ${name}
</td>
<td align="center"><a href="#"><img title="Descargar" onclick="descargarCertificado('','${nif}')"></a></td>
<td align="center"><a href="#"><img title="Visualizar" onclick="visualizarCertificado('','${nif}')"></a></td>
</tr></tbody></table>
Para descargar o visualizar un certificado debe introducir el Código de Verificación (Captcha)
<input type="text" name="answer" value="" id="answer"/><img src="/rolece/public/captcha.action" alt="CAPTCHA" id="captchaImage">
</form>`
