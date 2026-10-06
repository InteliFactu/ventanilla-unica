import { describe, expect, it } from 'vitest'

import { readButtonNames } from './readButtonNames'

describe('readButtonNames', () => {
  it('collects every kind of button and nothing else', () => {
    expect(
      readButtonNames(
        '<input type="image" name="a"/><input type="SUBMIT" name="b"/><input type="hidden" name="c"/><input type="button"/>',
      ),
    ).toEqual(new Set(['a', 'b', '']))
  })
})
