import { useLocation } from "react-router"

import { ConsentCard } from "../components/consent-card"

/** /oauth/consent: approve an MCP client (Claude) for the DB MCP. */
export function ConsentPage() {
  const { search } = useLocation()
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <ConsentCard search={search} />
      </div>
    </div>
  )
}
