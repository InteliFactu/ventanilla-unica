import { postForm } from '../../http/postForm'
import { dehuUrls } from '../api/dehuUrls'
import { completeSamlResponseRelay } from '../session/completeSamlResponseRelay'
import { readAuthData } from '../session/readAuthData'
import { authenticateFromServiceProvider } from './authenticateFromServiceProvider'
import { fetchAppearanceLoginForm } from './fetchers/fetchAppearanceLoginForm'
import type { AppearanceSession } from './types/AppearanceSession'

/**
 * Walk the second Cl@ve relay DEHU requires before opening one notification
 * and return the fresh bearer JWT its `appearance-login-check` hands back as
 * `authData` (captured 2026-10-07: the browser's acceptance used this token,
 * not the login one).
 */
export const reauthenticateForAppearance = async (
  session: AppearanceSession,
  reference: string,
): Promise<string> => {
  const { client } = session
  const form = await fetchAppearanceLoginForm(session, reference)
  const servicePage = await postForm(
    client,
    form,
    {},
    {
      referer: dehuUrls.base,
    },
  )
  const identityPage = await authenticateFromServiceProvider(
    client,
    servicePage,
  )
  const checkPage = await completeSamlResponseRelay(client, identityPage)
  const location = checkPage.headers['location']
  const authData = readAuthData(
    typeof location === 'string' ? location : checkPage.url,
    checkPage.url,
  )
  if (!authData)
    throw new Error('DEHU: no authData in the appearance-login-check answer')
  return authData
}
