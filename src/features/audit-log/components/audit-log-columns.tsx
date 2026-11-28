import { createColumnHelper } from "@tanstack/react-table"
import { CircleCheckIcon, CircleXIcon } from "lucide-react"

import type {
  DataTableColumns,
  DataTableFeatures,
} from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDateTime } from "@/lib/format"

import type { AuditEntry } from "../api/audit-log"
import { actionLabel, describeEntry, entryError } from "./describe-entry"

const column = createColumnHelper<DataTableFeatures, AuditEntry>()

export function auditLogColumns(
  onOpen: (entry: AuditEntry) => void
): DataTableColumns<AuditEntry> {
  return column.columns([
    column.accessor("createdAt", {
      header: "Time",
      cell: (info) => (
        <span className="whitespace-nowrap">
          {formatDateTime(info.getValue())}
        </span>
      ),
    }),
    column.accessor("admin", {
      header: "Admin",
      cell: (info) => {
        const admin = info.getValue()
        const email = admin?.email ?? info.row.original.actorEmail
        return (
          <div className="flex flex-col">
            <span>{admin?.name || email || "—"}</span>
            {admin?.name && (
              <span className="text-xs text-muted-foreground">{email}</span>
            )}
          </div>
        )
      },
    }),
    column.accessor("source", {
      header: "Source",
      cell: (info) => (
        <Badge variant={info.getValue() === "MCP" ? "secondary" : "outline"}>
          {info.getValue() === "MCP" ? "MCP" : "Dashboard"}
        </Badge>
      ),
    }),
    column.accessor("action", {
      header: "Action",
      cell: (info) => actionLabel[info.row.original.action],
    }),
    column.display({
      id: "what",
      header: "What",
      cell: (info) => {
        const entry = info.row.original
        const error = entryError(entry)
        return (
          <div className="flex max-w-md min-w-64 flex-col">
            <span
              className="truncate font-mono text-xs"
              title={describeEntry(entry)}
            >
              {describeEntry(entry)}
            </span>
            {error && (
              <span className="truncate text-xs text-destructive" title={error}>
                {error}
              </span>
            )}
          </div>
        )
      },
    }),
    column.accessor("succeeded", {
      header: "Result",
      cell: (info) =>
        info.getValue() ? (
          <span className="flex items-center gap-1 text-sm">
            <CircleCheckIcon className="size-4 text-emerald-600" />
            OK
          </span>
        ) : (
          <span className="flex items-center gap-1 text-sm text-destructive">
            <CircleXIcon className="size-4" />
            Refused
          </span>
        ),
    }),
    column.accessor("ipAddress", {
      header: "IP",
      cell: (info) => (
        <span className="font-mono text-xs">{info.getValue() ?? "—"}</span>
      ),
    }),
    column.display({
      id: "details",
      header: "",
      cell: (info) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpen(info.row.original)}
        >
          Details
        </Button>
      ),
    }),
  ])
}
