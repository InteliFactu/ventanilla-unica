/* eslint-disable security/detect-non-literal-fs-filename -- the two paths are literals in this file */
import { existsSync } from 'node:fs'

/** Whether xmlsec1 is installed, so the tests that shell out to it can run. */
export const hasXmlsec = ['/opt/homebrew/bin/xmlsec1', '/usr/bin/xmlsec1'].some(
  (path) => existsSync(path),
)
