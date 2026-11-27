/* eslint-disable security/detect-non-literal-fs-filename -- paths belong to this test's temporary directory */
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { buildClassicPdf } from '../../signing/pades/fixtures/buildClassicPdf'
import { fakeRegistryClient } from '../registry/fixtures/fakeRegistryClient'
import { postsOf } from '../registry/fixtures/postsOf'
import { respondWith } from '../registry/fixtures/respondWith'
import { fileRelecTramite } from './fileRelecTramite'
import { relecTramiteFormHtml } from './fixtures/relecTramiteFormHtml'
import { relecTramiteRoutes } from './fixtures/relecTramiteRoutes'

const dir = mkdtempSync(join(tmpdir(), 'relec-tramite-fields-'))
const pdf = join(dir, 'a.pdf')
writeFileSync(pdf, buildClassicPdf())
const sessionFramePath = '/sta/frame.jsp'
const context = { identity: buildTestIdentity(), confirmed: true }
const query = {
  dboid: '6269000000000000000001',
  subject: 'Test catalogue filing',
  documents: [pdf],
  rows: ['61'],
}

const editableControl = '<textarea name="DinVarDETAIL_TEST"></textarea>'

describe('fileRelecTramite fields', () => {
  it.each([
    [
      'an unquoted hidden control',
      '<input type=hidden name="DinVarDETAIL_TEST">',
    ],
    ['a non-text input', '<input type="checkbox" name="DinVarDETAIL_TEST">'],
    ['a read-only input', '<input readonly name=DinVarDETAIL_TEST>'],
    [
      'a hidden textarea',
      '<textarea hidden name=DinVarDETAIL_TEST></textarea>',
    ],
    [
      'a disabled fieldset',
      '<fieldset disabled><fieldset></fieldset><textarea name="DinVarDETAIL_TEST"></textarea></fieldset>',
    ],
    [
      'a control owned by another form',
      '<textarea name="DinVarDETAIL_TEST" form=unrelated></textarea>',
    ],
    [
      'duplicate controls',
      '<textarea name="DinVarDETAIL_TEST"></textarea><input name="DinVarDETAIL_TEST" type=hidden>',
    ],
    [
      'a duplicate select',
      '<textarea name="DinVarDETAIL_TEST"></textarea><select name=DinVarDETAIL_TEST><option value=a>A</option></select>',
    ],
    [
      'a control inside a textarea',
      '<textarea name="other"><input name="DinVarDETAIL_TEST"></textarea>',
    ],
    ['a control inside a template', `<template>${editableControl}</template>`],
  ] as const)(
    'refuses %s as an override before uploading',
    async (_, control) => {
      const client = fakeRegistryClient([
        [
          (url) => url.includes('/Relec/TramitaForm'),
          (url) =>
            respondWith(
              url,
              relecTramiteFormHtml.replace(editableControl, control),
            ),
        ],
        ...relecTramiteRoutes,
      ])
      await expect(
        fileRelecTramite(
          client,
          { ...query, variables: { DETAIL_TEST: 'Override' } },
          context,
        ),
      ).rejects.toThrow('does not offer a writable field')
      expect(postsOf(client).map((call) => new URL(call.url).pathname)).toEqual(
        [sessionFramePath],
      )
    },
  )

  it('posts one amended text input with the other dynamic defaults', async () => {
    const client = fakeRegistryClient(relecTramiteRoutes)
    await fileRelecTramite(
      client,
      { ...query, variables: { TEXT_TEST: 'Updated' } },
      context,
    )
    const posted = postsOf(client).find(({ url }) =>
      url.endsWith('/Relec/TramitaSign'),
    )
    const body = new URLSearchParams(String(posted?.body))
    expect(body.getAll('DinVarTEXT_TEST')).toEqual(['Updated'])
    expect(body.get('DinVarDEFAULT_DETAIL')).toBe('Prefilled & retained')
    expect(body.get('DinVarHIDDEN_DETAIL')).toBe('Keep this')
    expect(body.has('DinVarOTHER_FORM')).toBe(false)
    expect(body.has('DinVarDISABLED_DETAIL')).toBe(false)
  })

  it('refuses an unencodable default before uploading', async () => {
    const client = fakeRegistryClient([
      [
        (url) => url.includes('/Relec/TramitaForm'),
        (url) =>
          respondWith(
            url,
            relecTramiteFormHtml.replace(
              'Prefilled &amp; retained',
              '&#x1f600;',
            ),
          ),
      ],
      ...relecTramiteRoutes,
    ])
    await expect(fileRelecTramite(client, query, context)).rejects.toThrow(
      'has no ISO-8859-1 byte',
    )
    expect(postsOf(client).map((call) => new URL(call.url).pathname)).toEqual([
      sessionFramePath,
    ])
  })

  it('refuses a form response redirected away from Cáceres before uploading', async () => {
    const client = fakeRegistryClient([
      [
        (url) => url.includes('/Relec/TramitaForm'),
        () =>
          respondWith(
            'https://example.test/sta/Relec/TramitaForm',
            relecTramiteFormHtml,
          ),
      ],
      ...relecTramiteRoutes,
    ])
    await expect(fileRelecTramite(client, query, context)).rejects.toThrow(
      'outside the Cáceres signing flow',
    )
    expect(postsOf(client).map((call) => new URL(call.url).pathname)).toEqual([
      sessionFramePath,
    ])
  })
})
