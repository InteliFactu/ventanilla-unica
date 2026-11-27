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
  it.each([
    '/solicitudPaso6Token.action?operation=descargar',
    '/emitirCertificado.action?filename=certificado.pdf',
    '/emitirCertificado.action#download',
  ])('ignores a download hint outside the path of %s', (href) => {
    expect(
      readYouthGuaranteeDocuments(`<a href="${href}">Certificado</a>`),
    ).toEqual([])
  })
  it.each([
    '/certificado.pdf?ref=example',
    '/descargarJustificante.action?ref=example',
  ])('preserves the parameters of an offered download at %s', (href) => {
    expect(
      readYouthGuaranteeDocuments(`<a href="${href}">Justificante</a>`),
    ).toEqual([
      { label: 'Justificante', url: `https://garantiajuvenil.sepe.es${href}` },
    ])
  })
})
