import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../../signing/fixtures/buildTestIdentity'
import { fakeRegistryClient } from '../../registry/fixtures/fakeRegistryClient'
import { respondWith } from '../../registry/fixtures/respondWith'
import { relecSignPageHtml } from '../fixtures/relecSignPageHtml'
import { parseSignPage } from '../parsers/parseSignPage'
import { fetchDocumentTypes } from './fetchDocumentTypes'
import { fetchUploaderSession } from './fetchUploaderSession'
import { signRelecDocument } from './signRelecDocument'
import { signRelecFormXml } from './signRelecFormXml'
import { submitTramitaJustif } from './submitTramitaJustif'
import { submitTramitaSign } from './submitTramitaSign'
import { uploadRelecDocument } from './uploadRelecDocument'

const origin = 'https://sede.caceres.es'
const answering = (
  text: string,
  status = 200,
): ReturnType<typeof fakeRegistryClient> =>
  fakeRegistryClient([
    [(): boolean => true, (url: string) => respondWith(url, text, status)],
  ])
const target = {
  origin,
  slot: 0,
  person: '1',
  document: {
    path: import.meta.filename,
    name: 'a.pdf',
    bytes: 1,
    sha256: '',
    uploadName: 'a.pdf',
    typeCode: 'DECL',
    typeDboid: '2',
    description: 'd',
  },
  type: {
    code: 'DECL',
    dboid: '2',
    name: 'Declaración',
    extensions: 'pdf',
    maxSize: '0',
    reusable: 'false',
  },
}
const identity = buildTestIdentity()
const page = parseSignPage(relecSignPageHtml, `${origin}/sta/Relec/TramitaSign`)

describe('Relec fetchers refuse unexpected answers', () => {
  it('on the read side', async () => {
    await expect(
      fetchDocumentTypes(answering('', 500), origin),
    ).rejects.toThrow('ApordocAjaxLoader answered 500')
    await expect(
      fetchUploaderSession(answering('<p></p>'), target),
    ).rejects.toThrow('carried no session id')
  })

  it('on the upload and signing side', async () => {
    await expect(
      uploadRelecDocument(answering('<p>Error</p>'), target, 'S'),
    ).rejects.toThrow('FileUploader refused a.pdf')
    await expect(
      signRelecDocument(answering('bm9wZGY='), target, identity),
    ).rejects.toThrow('AutofirmaDownload10 did not return a.pdf')
    await expect(
      signRelecFormXml(answering('PHg+'), origin, page, identity),
    ).rejects.toThrow('did not return the registry form')
  })

  it('on the submission side', async () => {
    await expect(
      submitTramitaSign(
        answering('', 500),
        `${origin}/sta/Relec/TramitaForm`,
        [],
      ),
    ).rejects.toThrow('TramitaSign answered 500')
    await expect(
      submitTramitaJustif(answering('', 502), page, origin),
    ).rejects.toThrow('TramitaJustif answered 502')
  })
})
