/** An OAuth PKCE verifier and its S256 challenge, plus the `state` that pairs request and answer. */
export type PkcePair = {
  readonly verifier: string
  readonly challenge: string
  readonly state: string
}
