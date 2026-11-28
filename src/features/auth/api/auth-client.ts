import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import { oauthProviderClient } from "@better-auth/oauth-provider/client"

import { env } from "@/lib/env"

/**
 * Better Auth client for the backend's admin auth (mounted at /api/admin-auth).
 *
 * oauthProviderClient: the admin sign-in is also the OAuth server of the
 * backend's DB MCP (Claude). When the backend sends an admin here to sign in
 * or to consent, the page's URL carries a signed OAuth query; this plugin adds
 * it to the sign-in / consent request, and the backend answers with where to
 * go next (back to Claude), which the client follows.
 */
export const authClient = createAuthClient({
  baseURL: `${env.apiUrl}/api/admin-auth`,
  fetchOptions: { credentials: "include" },
  plugins: [adminClient(), oauthProviderClient()],
})

export type Session = typeof authClient.$Infer.Session

/** Does this page's URL carry a signed OAuth request from the backend? */
export function hasOAuthRequest(search: string = window.location.search) {
  const params = new URLSearchParams(search)
  return params.has("sig") && params.has("client_id")
}
