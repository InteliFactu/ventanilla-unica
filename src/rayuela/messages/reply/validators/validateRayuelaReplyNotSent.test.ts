import { expect, it } from 'vitest'
import { validateRayuelaReplyNotSent } from './validateRayuelaReplyNotSent'

const sent = {
  total: 1,
  notes: [],
  messages: [
    {
      id: '5',
      from: 'Ana, Jorge',
      subject: 'RE: Tutoría',
      body: 'Hola  Jorge',
      dateText: '',
      date: null,
      hasAttachments: false,
    },
  ],
}
const reply = {
  recipientName: 'Ana, Jorge',
  subject: 'RE: Tutoría',
  body: 'Hola Jorge',
}
it('refuses a reply already in the sent box', () => {
  expect(() => {
    validateRayuelaReplyNotSent(sent, reply)
  }).toThrow('already holds')
})
it('accepts a different text', () => {
  expect(() => {
    validateRayuelaReplyNotSent(sent, { ...reply, body: 'Otra cosa' })
  }).not.toThrow()
})
