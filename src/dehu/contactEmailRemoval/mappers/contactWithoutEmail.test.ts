import { describe, expect, it } from 'vitest'

import { contactWithoutEmail } from './contactWithoutEmail'
import { remainingContactEmails } from './remainingContactEmails'

const current = {
  nif: '00000000T',
  email1: 'ADVISOR@EXAMPLE.ORG',
  email1_confirmacion: 1,
  email2: 'owner@example.org',
  email2_confirmacion: 0,
  email3: null,
  telefono: '600000000',
  noticeTime: '24x7',
  contactoPush: [],
  createdAt: '2026-01-01',
}

describe('contactWithoutEmail', () => {
  it('compacts the slots, keeps each confirmation and drops server-only fields', () => {
    const body = contactWithoutEmail(current, 'advisor@example.org', '7')
    expect(body).toEqual({
      nif: '00000000T',
      telefono: '600000000',
      noticeTime: '24x7',
      legalTextId: 7,
      contactoPush: [],
      email1: 'owner@example.org',
      email1_confirmacion: 0,
      email2: null,
      email2_confirmacion: 0,
      email3: null,
      email3_confirmacion: 0,
      email4: null,
      email4_confirmacion: 0,
      email5: null,
      email5_confirmacion: 0,
    })
    expect(remainingContactEmails(body)).toEqual([
      { email: 'owner@example.org', confirmed: false },
    ])
  })

  it('refuses an email that is not there, or the last channel', () => {
    expect(() => contactWithoutEmail(current, 'x@example.org', '7')).toThrow(
      'not among the contact emails',
    )
    expect(() =>
      contactWithoutEmail(
        { nif: '00000000T', email1: 'a@example.org', email1_confirmacion: 1 },
        'a@example.org',
        '7',
      ),
    ).toThrow('no notice channel')
  })
})
