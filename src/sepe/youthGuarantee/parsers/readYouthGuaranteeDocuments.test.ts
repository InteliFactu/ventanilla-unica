import { describe, expect, it } from 'vitest'

import { readYouthGuaranteeDocuments } from './readYouthGuaranteeDocuments'

describe('offered certificate links', () => {
  it('resolves only offered same-origin downloads', () => {
    expect(
      readYouthGuaranteeDocuments(
        '<a href="/certificado.pdf">Certificado de inscripción</a><a href="https://example.com/a.pdf">Justificante</a><a href="javascript:emitir()">Certificado</a><a href="/solicitudPaso6Token.action">Certificado nuevo</a>',
      ),
    ).toEqual([
      {
        label: 'Certificado de inscripción',
        url: 'https://garantiajuvenil.sepe.es/certificado.pdf',
      },
    ])
  })
  it('does not follow an embedded credential URL', () => {
    expect(
      readYouthGuaranteeDocuments(
        '<a href="https://user:pass@garantiajuvenil.sepe.es/a.pdf">Justificante</a>',
      ),
    ).toEqual([])
  })
})
