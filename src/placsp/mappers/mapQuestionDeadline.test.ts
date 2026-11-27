import { describe, expect, it } from 'vitest'

import { mapQuestionDeadline } from './mapQuestionDeadline'

describe('mapQuestionDeadline', () => {
  it('counts twelve days back from the submission deadline', () => {
    expect(mapQuestionDeadline('19/10/2026 23:59')).toEqual({
      submissionEnd: '2026-10-19',
      askBy: '2026-10-07',
    })
    expect(mapQuestionDeadline('05/03/2026')).toEqual({
      submissionEnd: '2026-03-05',
      askBy: '2026-02-21',
    })
  })

  it('answers nothing without a date', () => {
    expect(mapQuestionDeadline(undefined)).toBeUndefined()
    expect(mapQuestionDeadline('Pendiente')).toBeUndefined()
  })

  it('retains a valid leap day from the published date', () => {
    expect(mapQuestionDeadline('29/02/2028 12:00')).toEqual({
      submissionEnd: '2028-02-29',
      askBy: '2028-02-17',
    })
  })

  it.each(['29/02/2026', '31/04/2026', '00/10/2026', '19/10/20260'])(
    'omits the calculation for an invalid published date %s',
    (date) => {
      expect(mapQuestionDeadline(date)).toBeUndefined()
    },
  )
})
