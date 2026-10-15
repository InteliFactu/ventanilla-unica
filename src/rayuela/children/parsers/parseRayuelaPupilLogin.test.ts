import { expect, it } from 'vitest'
import { parseRayuelaPupilLogin } from './parseRayuelaPupilLogin'

it('reads synthetic parseRayuelaPupilLogin markup', () => {
  expect(
    parseRayuelaPupilLogin(
      "<div class='tLogin'>dana.example</div><div onclick='generate()'>Reset</div>",
    ),
  ).toBe('dana.example')
  expect(parseRayuelaPupilLogin('')).toBe('')
})
