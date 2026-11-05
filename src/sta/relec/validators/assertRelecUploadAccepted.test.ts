import { describe, expect, it } from 'vitest'

import { respondWith } from '../../registry/fixtures/respondWith'
import { assertRelecUploadAccepted } from './assertRelecUploadAccepted'

const sizeAlert = respondWith(
  'https://sede.caceres.es/sta/FileUploader',
  '<script>alert("Tamaño de archivo excedido. Limite 50000 KBytes");</script>',
)

describe('assertRelecUploadAccepted', () => {
  it('suggests flattening the local source file, not the sanitised upload name', () => {
    expect(() => {
      assertRelecUploadAccepted(
        sizeAlert,
        'Declaracinresponsable.pdf',
        '/documents/Declaración responsable.pdf',
      )
    }).toThrow(
      "the sede refused the PDF Declaracinresponsable.pdf (likely an existing signature or form, not its size); flatten it and retry, e.g. gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -o flat.pdf '/documents/Declaración responsable.pdf'",
    )
  })

  it('accepts the uploadEnd script', () => {
    expect(() => {
      assertRelecUploadAccepted(
        respondWith('u', '<script>parent.uploadEnd();</script>'),
        'a.pdf',
        '/a.pdf',
      )
    }).not.toThrow()
  })
})
