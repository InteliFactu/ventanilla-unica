/**
 * Whether the FileUploader answered its size alert,
 * `alert("Tamaño de archivo excedido. Limite 50000 KBytes")`. The sede also
 * raises it for small PDFs it cannot process: on 2026-11-04 a 369 KB invoice
 * carrying an AcroForm `/Sig` field drew it three times, and the same file
 * rewritten by Ghostscript uploaded. Matched without the accented letter so
 * a Latin-1 or entity-encoded answer still counts.
 */
export const isRelecSizeAlert = (text: string): boolean =>
  /alert\s*\(\s*["'][^"']*archivo excedido/iu.test(text)
