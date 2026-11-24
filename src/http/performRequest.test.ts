import { execFile } from 'node:child_process'
import { mkdtemp, readFile } from 'node:fs/promises'
import { createServer, type Server } from 'node:https'
import type { AddressInfo } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { TLSSocket } from 'node:tls'
import { promisify } from 'node:util'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { CookieJar } from './CookieJar'
import { performRequest } from './performRequest'

// A throwaway self-signed certificate plays both the server and the client
// identity: the server demands a client certificate and records its subject,
// which is the one thing this transport exists to do.
const run = promisify(execFile)

const identity = { cert: Buffer.alloc(0), key: Buffer.alloc(0) }
let server: Server
let origin = ''
let seenSubject = ''
let seenCookie = ''
let seenBody = ''

beforeAll(async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ventanilla-unica-tls-'))
  const certPath = join(dir, 'cert.pem')
  const keyPath = join(dir, 'key.pem')
  const subject = '/CN=ventanilla-unica-test'
  const shape = ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1']
  const files = ['-subj', subject, '-keyout', keyPath, '-out', certPath]
  await run('openssl', [...shape, ...files])
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  identity.cert = await readFile(certPath)
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  identity.key = await readFile(keyPath)
  server = createServer(
    { ...identity, ca: [identity.cert], requestCert: true },
    (req, res) => {
      if (!(req.socket instanceof TLSSocket)) {
        throw new Error('Expected an HTTPS socket')
      }
      const peer = req.socket.getPeerCertificate()
      seenSubject = String(peer.subject.CN)
      seenCookie = req.headers.cookie ?? ''
      let body = ''
      req.on('data', (chunk: Buffer) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        seenBody = body
        res.setHeader('Set-Cookie', ['session=42; Path=/'])
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(`${req.method ?? ''} ${req.url ?? ''}`)
      })
    },
  )
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve)
  })
  origin = `https://127.0.0.1:${String((server.address() as AddressInfo).port)}`
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
})

afterAll(async () => {
  delete process.env['NODE_TLS_REJECT_UNAUTHORIZED']
  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve()
    })
  })
})

describe('performRequest', () => {
  it('offers the client certificate, posts the form and stores the cookies', async () => {
    const jar = new CookieJar()
    const response = await performRequest(`${origin}/x?y=1`, identity, jar, {
      form: { a: 'b c' },
    })
    expect(response.status).toBe(200)
    expect(response.text).toBe('POST /x?y=1')
    expect(seenSubject).toBe('ventanilla-unica-test')
    expect(seenBody).toBe('a=b+c')
    expect(jar.get('127.0.0.1', 'session')).toBe('42')
    await performRequest(`${origin}/again`, identity, jar, {})
    expect(seenCookie).toBe('session=42')
  })

  it('fails on a timeout instead of hanging', async () => {
    const jar = new CookieJar()
    await expect(
      performRequest('https://10.255.255.1/', identity, jar, {
        timeoutMs: 100,
      }),
    ).rejects.toThrow(/timeout|EHOSTUNREACH|ENETUNREACH|ECONNREFUSED/)
  })
})
