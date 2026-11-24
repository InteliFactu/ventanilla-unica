import { createKnipConfig } from '@syntopica/quality-config/knip'

export default createKnipConfig({
  framework: 'ts-package',
  // src/index.ts is the library's public API, consumed by dependants rather
  // than by this repository; checking its exports would report the whole
  // surface as dead.
  includeEntryExports: false,
  // External binaries used by the secret check and the signature fixtures.
  ignoreBinaries: ['gitleaks', 'xmlsec1'],
})
