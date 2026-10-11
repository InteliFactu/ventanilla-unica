/**
 * The state Carpeta Ciudadana. Its web front authenticates with OpenID Connect
 * (authorization code + PKCE) against the SGAD Keycloak realm, which brokers
 * Cl@ve; `acr_values` `idp:AFIRMA` asks for the certificate IdP. The Keycloak
 * access token is then traded for the Carpeta's own token, which every `/api`
 * call carries as a bare `Authorization` value (no `Bearer` prefix).
 */
export const carpetaUrls = {
  origin: 'https://carpetaciudadana.gob.es',
  signin: 'https://carpetaciudadana.gob.es/signin',
  oidc: 'https://auth-api.redsara.es/auth/realms/sgad-appfactory/protocol/openid-connect',
  clientId: '505e27a4-19ba-4714-98ad-48d691d721f7',
  acrValues: 'loa:2 idp:AFIRMA',
  carpetaToken:
    'https://carpetaciudadana.gob.es/authorization/keycloak/create-cc-token',
  alertSettings:
    'https://carpetaciudadana.gob.es/api/v2/configuracionAvisos?lang=es',
  verifyEmail: 'https://carpetaciudadana.gob.es/api/verificar-email',
  confirmEmail: 'https://carpetaciudadana.gob.es/api/confirmar-email',
  claveOrigin: 'https://pasarela.clave.gob.es',
  certificateIdp: 'AFIRMA',
} as const
