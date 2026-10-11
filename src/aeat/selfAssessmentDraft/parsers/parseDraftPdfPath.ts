/** The path of the rendered draft (`.../zkau/view/<desktop>/<uuid>/.../PDFborrador.pdf`) in a Vista previa answer. */
export const parseDraftPdfPath = (answer: string): string | undefined =>
  /(\/wlpl\/[^'"\s]*?\/zkau\/view\/[^'"\s]*?\.pdf)/.exec(answer)?.[1]
