import { redirect, type LoaderFunctionArgs } from "react-router"

import { queryClient } from "@/lib/query-client"

import { hasOAuthRequest } from "./auth-client"
import { isAdmin, sessionQueryOptions } from "./session"

/**
 * Only allow same-app paths as post-login redirects. Resolving against our own
 * origin catches every way of naming another host ("//x", "/\x", "https:x").
 */
export function safeRedirect(to: string | null | undefined) {
  if (!to) return "/dashboard"
  try {
    const url = new URL(to, window.location.origin)
    if (url.origin === window.location.origin) {
      return url.pathname + url.search + url.hash
    }
  } catch {
    // not a URL at all
  }
  return "/dashboard"
}

/**
 * Current session, or null if signed out or the API can't be reached.
 * queryClient.query respects staleTime, so a session invalidated by sign-in or
 * sign-out is refetched instead of served stale from cache.
 */
async function loadSession() {
  try {
    return await queryClient.query(sessionQueryOptions)
  } catch {
    return null
  }
}

/** Loader for protected routes: send anyone who isn't an admin to /login. */
export async function requireAdmin({ request }: LoaderFunctionArgs) {
  const session = await loadSession()
  if (!isAdmin(session)) {
    const { pathname, search } = new URL(request.url)
    throw redirect(`/login?redirect=${encodeURIComponent(pathname + search)}`)
  }
  return null
}

/**
 * Loader for /login: already signed-in admins go straight to the app - unless
 * the backend's OAuth server sent them here to sign in again (prompt=login):
 * then the sign-in itself continues that request.
 */
export async function redirectIfSignedIn({ request }: LoaderFunctionArgs) {
  if (hasOAuthRequest(new URL(request.url).search)) return null
  const session = await loadSession()
  if (isAdmin(session)) {
    throw redirect(
      safeRedirect(new URL(request.url).searchParams.get("redirect"))
    )
  }
  return null
}
