import { parseAsString, useQueryState } from "nuqs"
import { useNavigate } from "react-router"

import { cn } from "cn"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { hasOAuthRequest } from "../api/auth-client"
import { safeRedirect } from "../api/route-guards"
import { useSignIn } from "../hooks/use-sign-in"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [redirectTo] = useQueryState("redirect", parseAsString)
  const signIn = useSignIn()
  // Sent here by the backend's OAuth server (connecting Claude to the DB MCP)
  const oauth = hasOAuthRequest()
  const leaving = signIn.isSuccess && signIn.data.leaving

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    signIn.mutate(
      {
        email: String(form.get("email")),
        password: String(form.get("password")),
      },
      {
        onSuccess: ({ leaving }) => {
          if (!leaving) navigate(safeRedirect(redirectTo), { replace: true })
        },
      }
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Logo className="h-20 w-auto" />
            <h1 className="text-xl font-bold">BitcoinDeepa Admin</h1>
            <FieldDescription>
              {oauth
                ? "Sign in with your admin account to connect an MCP client"
                : "Sign in with your admin account"}
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@example.com"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>
          {signIn.error && <FieldError>{signIn.error.message}</FieldError>}
          <Field>
            <Button type="submit" disabled={signIn.isPending || leaving}>
              {leaving
                ? "Continuing..."
                : signIn.isPending
                  ? "Signing in..."
                  : "Sign in"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
