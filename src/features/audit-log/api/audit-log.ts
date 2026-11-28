import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import type { PageSize } from "@/components/data-table"
import { apiFetch } from "@/lib/api"

export const AUDIT_SOURCES = ["ADMIN", "MCP"] as const
export type AuditSource = (typeof AUDIT_SOURCES)[number]

export const AUDIT_ACTIONS = [
  "READ",
  "CREATE",
  "UPDATE",
  "DELETE",
  "SIGN_IN",
  "SIGN_OUT",
  "CONSENT",
] as const
export type AuditAction = (typeof AUDIT_ACTIONS)[number]

export const AUDIT_OUTCOMES = ["true", "false"] as const
export type AuditOutcome = (typeof AUDIT_OUTCOMES)[number]

/** One audit_log entry (backend GET /admin/audit-log). */
export interface AuditEntry {
  id: string
  createdAt: string
  action: AuditAction
  /** admin_request, mcp_request, admin_session, oauth_consent, or a table name */
  entityType: string
  entityId: string | null
  source: AuditSource
  admin: { id: string; name: string; email: string } | null
  /** Who it was, also after the admin is removed; the email tried for a failed sign-in */
  actorEmail: string | null
  succeeded: boolean
  /** Request: method, path, query, body, status. MCP: tool, sql, params, row_count, error */
  snapshot: Record<string, unknown>
  ipAddress: string | null
  userAgent: string | null
}

export interface AuditPage {
  items: AuditEntry[]
  total: number
  page: number
  pageSize: number
  pageCount: number
}

export interface AuditFilters {
  page?: number
  pageSize?: PageSize
  source?: AuditSource | null
  action?: AuditAction | null
  succeeded?: AuditOutcome | null
  from?: string | null
  to?: string | null
  q?: string | null
}

export const auditLogQueryOptions = (filters: AuditFilters) => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value))
    }
  }
  return queryOptions({
    queryKey: ["admin", "audit-log", filters],
    queryFn: () => apiFetch<AuditPage>(`/admin/audit-log?${params.toString()}`),
    placeholderData: keepPreviousData,
  })
}
