/** The SAML request the sede answers with: the action to post to, the request and the relay state. */
export type DgsfpSamlRequest = {
  readonly action: string
  readonly samlRequest: string
  readonly relayState: string
}
