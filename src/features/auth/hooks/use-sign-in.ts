import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authClient } from "../api/auth-client"
import { sessionQueryOptions } from "../api/session"

export interface SignInInput {
  email: string
  password: string
}

export interface SignInResult {
  /** The sign-in continued an OAuth request: the browser is leaving for its next step. */
  leaving: boolean
}

export function useSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: SignInInput): Promise<SignInResult> => {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      })
      if (error) throw new Error(error.message ?? "Sign in failed")
      // Better Auth's client follows { redirect: true, url } on its own
      return { leaving: Boolean(data?.redirect && data.url) }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: sessionQueryOptions.queryKey }),
  })
}
