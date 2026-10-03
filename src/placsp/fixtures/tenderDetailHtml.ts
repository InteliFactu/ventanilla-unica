/** A synthetic PLACSP "Detalle de la licitación" page with the spans `readTenderDetail` reads. */
export const tenderDetailHtml = (
  estado = 'Publicada',
  fin = '19/10/2026 23:59',
): string =>
  [
    ['label_OC', '&#211;rgano de contrataci&#243;n'],
    ['text_OC_con', '&#211;rgano de ejemplo'],
    ['text_Expediente', '2026/0001'],
    ['text_ObjetoContrato', 'Servicio de maquetaci&#243;n de ejemplo'],
    [
      'text_EnlaceLicPLACE',
      'https://contrataciondelestado.es/wps/poc?uri=deeplink:detalle_licitacion&amp;idEvl=abcDEF0123456%2B%3D%3D',
    ],
    ['text_Estado', estado],
    ['text_FechaPresentacionOfertaConHora', fin],
  ]
    .map(
      ([name = '', text = '']) =>
        `<span id="viewns_Z7_TEST_:form1:${name}" title="${text}" class="bold">${text}</span>`,
    )
    .join('\n')
