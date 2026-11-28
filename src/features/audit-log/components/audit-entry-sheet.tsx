import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { formatDateTime } from "@/lib/format"

import type { AuditEntry } from "../api/audit-log"
import { actionLabel, describeEntry } from "./describe-entry"

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="break-all">{children}</span>
    </div>
  )
}

/** Everything one audit entry recorded. */
export function AuditEntrySheet({
  entry,
  onClose,
}: {
  entry: AuditEntry | null
  onClose: () => void
}) {
  const sql =
    entry && typeof entry.snapshot.sql === "string" ? entry.snapshot.sql : null
  const rest = entry
    ? Object.fromEntries(
        Object.entries(entry.snapshot).filter(([key]) => key !== "sql")
      )
    : {}

  return (
    <Sheet open={entry !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full data-[side=right]:sm:max-w-2xl">
        {entry && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {actionLabel[entry.action]}
                <Badge variant={entry.succeeded ? "outline" : "destructive"}>
                  {entry.succeeded ? "OK" : "Refused"}
                </Badge>
              </SheetTitle>
              <SheetDescription className="font-mono text-xs break-all">
                {describeEntry(entry)}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-3 overflow-y-auto px-4 pb-6">
              <Row label="Time">{formatDateTime(entry.createdAt)}</Row>
              <Row label="Admin">
                {entry.admin
                  ? `${entry.admin.name} (${entry.admin.email})`
                  : (entry.actorEmail ?? "—")}
              </Row>
              <Row label="Source">
                {entry.source === "MCP" ? "DB MCP (Claude)" : "Dashboard"}
              </Row>
              <Row label="Entity">
                {entry.entityType}
                {entry.entityId ? ` · ${entry.entityId}` : ""}
              </Row>
              <Row label="IP">{entry.ipAddress ?? "—"}</Row>
              <Row label="User agent">{entry.userAgent ?? "—"}</Row>
              {sql && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">SQL</span>
                  <pre className="rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap">
                    {sql}
                  </pre>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Details</span>
                <pre className="rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap">
                  {JSON.stringify(rest, null, 2)}
                </pre>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
