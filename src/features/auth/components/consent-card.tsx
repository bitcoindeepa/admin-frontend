import { useMutation, useQuery } from "@tanstack/react-query"
import { CheckIcon, DatabaseIcon, ShieldCheckIcon } from "lucide-react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldError } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"

import {
  answerConsent,
  oauthClientQueryOptions,
  SCOPE_LABELS,
} from "../api/oauth"
import { useSession } from "../hooks/use-session"

/**
 * Asks the signed-in admin whether an MCP client (Claude) may use the
 * backend's read-only DB MCP as them. Opened by the backend's OAuth server
 * with a signed query (client_id, scope, resource, ...).
 */
export function ConsentCard({ search }: { search: string }) {
  const params = new URLSearchParams(search)
  const clientId = params.get("client_id") ?? ""
  const scopes = (params.get("scope") ?? "").split(" ").filter(Boolean)
  const resource = params.getAll("resource")[0]

  const session = useSession()
  const client = useQuery({
    ...oauthClientQueryOptions(clientId),
    enabled: !!clientId,
  })
  const answer = useMutation({ mutationFn: answerConsent })
  const leaving = answer.isSuccess
  const busy = answer.isPending || leaving
  const name = client.data?.client_name ?? "An application"

  if (!clientId || !params.has("sig")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nothing to approve</CardTitle>
          <CardDescription>
            This page is opened by an application asking for access. Start again
            from the application.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Logo className="mx-auto h-16 w-auto" />
        <CardTitle className="text-xl">
          {client.isPending ? (
            <Skeleton className="mx-auto h-6 w-48" />
          ) : (
            <>Allow {name} to access BitcoinDeepa?</>
          )}
        </CardTitle>
        <CardDescription>
          Signed in as{" "}
          <span className="font-medium text-foreground">
            {session.data?.user.email ?? "..."}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {client.isError && (
          <FieldError>
            Couldn&apos;t load this application: {client.error.message}
          </FieldError>
        )}
        <div className="flex gap-3 rounded-lg border bg-muted/40 p-3">
          <DatabaseIcon className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="flex flex-col gap-1 text-sm">
            <span className="font-medium">
              Read the BitcoinDeepa database as you
            </span>
            <span className="text-muted-foreground">
              Read-only SQL on members, payments, sales and the other tables.
              Credentials are never readable, and every query is logged under
              your name.
            </span>
            {resource && (
              <span className="font-mono text-xs break-all text-muted-foreground">
                {resource}
              </span>
            )}
          </div>
        </div>
        {scopes.length > 0 && (
          <ul className="flex flex-col gap-2 text-sm">
            {scopes.map((scope) => (
              <li key={scope} className="flex items-center gap-2">
                <CheckIcon className="size-4 text-muted-foreground" />
                {SCOPE_LABELS[scope] ?? scope}
              </li>
            ))}
          </ul>
        )}
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheckIcon className="mt-0.5 size-3.5 shrink-0" />
          Only allow this if you started connecting {name} yourself just now.
        </p>
        {answer.isError && <FieldError>{answer.error.message}</FieldError>}
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          disabled={busy}
          onClick={() => answer.mutate(false)}
        >
          Deny
        </Button>
        <Button
          disabled={busy || client.isPending || client.isError}
          onClick={() => answer.mutate(true)}
        >
          {leaving ? "Continuing..." : "Allow"}
        </Button>
      </CardFooter>
    </Card>
  )
}
