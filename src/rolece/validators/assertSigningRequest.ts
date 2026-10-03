/**
 * Refuse unless the signing screen asks AutoFirma for exactly what this tool
 * reproduces: an enveloped XAdES of `campoXML` with SHA256withRSA, node
 * `root`, the signature returned in `xmlFirmado` (decoded) and `firma`
 * (base64), and the form submitted to `firmaSolicitud!firmarSolicitud`.
 */
export const assertSigningRequest = (html: string): void => {
  const expectedCalls = [
    String.raw`var params = "format=XAdES Enveloped\nmode=implicit\naddKeyInfoKeyName=true\nignoreStyleSheets=false\nfilter=signingCert\nnodeToSign=root";`,
    String.raw`encode64(document.getElementById("campoXML").value),`,
    String.raw`"SHA256withRSA",`,
    String.raw`"XADES",`,
    String.raw`document.getElementById("xmlFirmado").value=decode64(signatureB64);`,
    String.raw`document.getElementById("firma").value = signatureB64;`,
    `onclick="preparaFormulario('firmaSolicitud','/comun/firmaSolicitud!firmarSolicitud');return firmaXADESEnvelopedXML();"`,
  ]
  const missing = expectedCalls.filter((call) => !html.includes(call))
  if (missing.length > 0)
    throw new Error(
      `ROLECE: the signing screen no longer asks AutoFirma for the captured signature; changed: ${missing.join(' | ')}`,
    )
}
