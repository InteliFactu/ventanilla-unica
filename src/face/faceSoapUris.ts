/** Namespaces and identifiers used by the FACe SOAP binding and WS-Security. */
export const faceSoapUris = {
  soap: 'http://schemas.xmlsoap.org/soap/envelope/',
  legacy: 'https://webservice.face.gob.es',
  supplier: {
    production: 'https://ws.face.gob.es/proveedores/v1/factura',
    sandbox: 'https://se-ws-face.redsara.es/proveedores/v1/factura',
  },
  wsse: 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
  wsu: 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
  exclusive: 'http://www.w3.org/2001/10/xml-exc-c14n#',
  x509: 'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3',
  base64Binary:
    'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary',
} as const
