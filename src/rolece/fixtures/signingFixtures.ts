import { buildTestIdentity } from '../../signing/fixtures/buildTestIdentity'
import { applicationDocumentXml } from './applicationDocumentXml'

/** The operator, the representative and the application document every signing test shares. */
export const signingFixtures = {
  nif: 'B00000000',
  sender: '00000000T',
  email: 'info@example.com',
  identity: buildTestIdentity('00000000T TEST (R: B00000000)'),
  document: applicationDocumentXml({
    nif: 'B00000000',
    sender: '00000000T',
    email: 'info@example.com',
  }),
}
