import { queryOptions } from "@tanstack/react-query"

import { authClient } from "./auth-client"

export interface OAuthClientInfo {
  client_id: string
  client_name?: string
  client_uri?: string
  logo_uri?: string
}

/** Public details (name, logo) of the OAuth client asking for access. */
export const oauthClientQueryOptions = (clientId: string) =>
  queryOptions({
    queryKey: ["auth", "oauth-client", clientId],
    queryFn: async (): Promise<OAuthClientInfo> => {
      const { data, error } = await authClient.oauth2.publicClient({
        query: { client_id: clientId },
      })
      if (error) throw new Error(error.message ?? "Unknown application")
      return data as OAuthClientInfo
    },
    retry: false,
  })

/**
 * Answers the consent request this page was opened with. The OAuth client
 * plugin sends the page's signed query along; Better Auth's client then
 * follows the redirect back to the application (with a code, or
 * access_denied).
 */
export async function answerConsent(accept: boolean) {
  const { data, error } = await authClient.oauth2.consent({ accept })
  if (error) throw new Error(error.message ?? "Couldn't complete the request")
  return data
}

/** What each scope the backend can grant means, in the admin's terms. */
export const SCOPE_LABELS: Record<string, string> = {
  openid: "Know which admin account you are",
  profile: "See your name",
  email: "See your email address",
  offline_access: "Stay connected until you disconnect it",
}
