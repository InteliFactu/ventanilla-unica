import { promisify } from 'node:util'

import { describe, expect, it } from 'vitest'

import { lookupPublicAddress } from './lookupPublicAddress'

const resolveOne = promisify(lookupPublicAddress)

describe('lookupPublicAddress', () => {
  it('refuses a name that resolves to loopback', async () => {
    await expect(resolveOne('localhost', {})).rejects.toThrow(
      'internal address',
    )
  })

  it('passes a public address through', async () => {
    await expect(resolveOne('8.8.8.8', {})).resolves.toBe('8.8.8.8')
  })
})
