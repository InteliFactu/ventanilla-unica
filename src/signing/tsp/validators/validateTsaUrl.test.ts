import { describe, expect, it } from 'vitest'

import { validateTsaUrl } from './validateTsaUrl'

describe('validateTsaUrl', () => {
  it.each([
    'https://freetsa.org/tsr',
    'http://tsa.example.org:8080/tsa',
    'https://8.8.8.8/tsr',
  ])('accepts %s', (url) => {
    expect(() => {
      validateTsaUrl(url)
    }).not.toThrow()
  })

  it.each([
    'file:///etc/passwd',
    'http://localhost:8080/',
    'http://127.0.0.1/',
    'http://10.1.2.3/',
    'http://192.168.1.1/',
    'http://169.254.169.254/latest/meta-data',
    'http://[::1]/',
    'http://[fd00::1]/',
    'http://[::ffff:127.0.0.1]/',
    'http://router/',
    'http://nas.local/',
  ])('refuses %s', (url) => {
    expect(() => {
      validateTsaUrl(url)
    }).toThrow()
  })
})
