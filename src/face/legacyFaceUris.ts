/** Namespace and transform identifiers used by the archived RPC-literal request. */
export const legacyFaceUris = {
  soap: 'http://schemas.xmlsoap.org/soap/envelope/',
  face: 'https://webservice.face.gob.es',
  wsse: 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
  wsu: 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
  exclusive: 'http://www.w3.org/2001/10/xml-exc-c14n#',
} as const
