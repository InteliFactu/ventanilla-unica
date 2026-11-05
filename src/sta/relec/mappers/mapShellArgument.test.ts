import { describe, expect, it } from 'vitest'

import { mapShellArgument } from './mapShellArgument'

describe('mapShellArgument', () => {
  it('keeps spaces, accents and shell metacharacters inside one argument', () => {
    expect(mapShellArgument('/documents/Declaración responsable.pdf')).toBe(
      "'/documents/Declaración responsable.pdf'",
    )
    expect(mapShellArgument('/tmp/$HOME `x`.pdf')).toBe("'/tmp/$HOME `x`.pdf'")
  })

  it('escapes a single quote by closing and reopening the quoted text', () => {
    expect(mapShellArgument("/tmp/O'Brien.pdf")).toBe(
      String.raw`'/tmp/O'\''Brien.pdf'`,
    )
  })
})
