/**
 * The authorization code on the `/signin` URL Keycloak sends the browser back
 * to; refuses an answer whose `state` is not the one this login sent.
 */
export const readAuthorizationCode = (url: string, state: string): string => {
  const params = new URL(url).searchParams
  const code = params.get('code')
  if (!code || params.get('state') !== state)
    throw new Error(
      `Carpeta: the login did not return an authorization code for this request (${new URL(url).pathname})`,
    )
  return code
}
