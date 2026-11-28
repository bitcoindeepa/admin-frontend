import { XIcon } from "lucide-react"

import { DataTableSearch } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  AUDIT_ACTIONS,
  type AuditAction,
  type AuditOutcome,
  type AuditSource,
} from "../api/audit-log"
import { useAuditLogFilters } from "../hooks/use-audit-log-filters"
import { actionLabel } from "./describe-entry"

const ALL = "all"
const sourceItems: Record<string, string> = {
  [ALL]: "All sources",
  ADMIN: "Dashboard",
  MCP: "DB MCP (Claude)",
}
const actionItems: Record<string, string> = {
  [ALL]: "All actions",
  ...Object.fromEntries(AUDIT_ACTIONS.map((a) => [a, actionLabel[a]])),
}
const outcomeItems: Record<string, string> = {
  [ALL]: "Any result",
  true: "OK",
  false: "Refused",
}

function FilterSelect({
  label,
  items,
  value,
  onChange,
  className,
}: {
  label: string
  items: Record<string, string>
  value: string | null
  onChange: (value: string | null) => void
  className?: string
}) {
  return (
    <Select
      items={items}
      value={value ?? ALL}
      onValueChange={(next) => onChange(next === ALL ? null : next)}
    >
      <SelectTrigger className={className} aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(items).map(([key, text]) => (
          <SelectItem key={key} value={key}>
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function AuditLogFilters() {
  const [filters, setFilters] = useAuditLogFilters()
  const hasFilters = Boolean(
    filters.source ||
    filters.action ||
    filters.succeeded ||
    filters.from ||
    filters.to ||
    filters.q
  )

  return (
    <div className="flex flex-wrap items-end gap-2">
      <DataTableSearch
        value={filters.q}
        onChange={(q) =>
          void setFilters({ q, page: null }, { history: "replace" })
        }
        placeholder="Admin, IP, id, path or SQL"
        label="Search the audit log"
      />
      <FilterSelect
        label="Source"
        items={sourceItems}
        value={filters.source}
        onChange={(source) =>
          void setFilters({ source: source as AuditSource | null, page: null })
        }
        className="w-44"
      />
      <FilterSelect
        label="Action"
        items={actionItems}
        value={filters.action}
        onChange={(action) =>
          void setFilters({ action: action as AuditAction | null, page: null })
        }
        className="w-36"
      />
      <FilterSelect
        label="Result"
        items={outcomeItems}
        value={filters.succeeded}
        onChange={(succeeded) =>
          void setFilters({
            succeeded: succeeded as AuditOutcome | null,
            page: null,
          })
        }
        className="w-32"
      />
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        From
        <Input
          type="date"
          value={filters.from ?? ""}
          max={filters.to ?? undefined}
          onChange={(e) =>
            void setFilters({ from: e.target.value || null, page: null })
          }
          className="w-40"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        To
        <Input
          type="date"
          value={filters.to ?? ""}
          min={filters.from ?? undefined}
          onChange={(e) =>
            void setFilters({ to: e.target.value || null, page: null })
          }
          className="w-40"
        />
      </label>
      {hasFilters && (
        <Button
          variant="ghost"
          onClick={() =>
            void setFilters({
              source: null,
              action: null,
              succeeded: null,
              from: null,
              to: null,
              q: null,
              page: null,
            })
          }
        >
          <XIcon />
          Clear
        </Button>
      )}
    </div>
  )
}
