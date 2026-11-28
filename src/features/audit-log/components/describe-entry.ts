import type { AuditAction, AuditEntry } from "../api/audit-log"

export const actionLabel: Record<AuditAction, string> = {
  READ: "Read",
  CREATE: "Create",
  UPDATE: "Update",
  DELETE: "Delete",
  SIGN_IN: "Sign in",
  SIGN_OUT: "Sign out",
  CONSENT: "Consent",
}

const str = (value: unknown) => (typeof value === "string" ? value : "")

/** "Approve bank account", "Read /admin/members", "query: select ..." */
export function describeEntry(entry: AuditEntry): string {
  const s = entry.snapshot
  switch (entry.entityType) {
    case "mcp_request": {
      const tool = str(s.tool)
      const sql = str(s.sql)
      if (sql) return `${tool}: ${sql}`
      const args = s.arguments as { table?: string; tables?: string[] }
      const target = args?.table ?? args?.tables?.join(", ")
      return target ? `${tool}: ${target}` : tool
    }
    case "admin_session":
      if (entry.action === "SIGN_OUT") return "Signed out"
      if (!entry.succeeded) return `Sign-in refused: ${str(s.error) || "error"}`
      return s.oauth_client_id
        ? "Signed in to connect an MCP client"
        : "Signed in"
    case "oauth_consent":
      return s.accepted
        ? `Allowed MCP client ${entry.entityId ?? ""}`
        : `Denied MCP client ${entry.entityId ?? ""}`
    case "user_bank_account": {
      const path = str(s.path)
      if (path.endsWith("/approve")) return "Approve bank account"
      if (path.endsWith("/reject")) {
        const reason = (s.body as { reason?: string })?.reason
        return reason ? `Reject bank account: ${reason}` : "Reject bank account"
      }
      if (path.endsWith("/statement")) return "Open bank statement"
      return `${str(s.method)} ${path}`
    }
    case "admin_user":
      if (entry.action === "CREATE") {
        const email = (s.body as { email?: string })?.email
        return email ? `Add admin ${email}` : "Add admin"
      }
      return `${str(s.method)} ${str(s.path)}`
    default: {
      const query = s.query as Record<string, unknown> | undefined
      const qs =
        query && typeof query === "object"
          ? new URLSearchParams(
              Object.entries(query).map(([k, v]) => [k, String(v)])
            ).toString()
          : ""
      return `${str(s.method)} ${str(s.path)}${qs ? `?${qs}` : ""}`
    }
  }
}

/** Why it failed, for a refused entry */
export function entryError(entry: AuditEntry): string | null {
  if (entry.succeeded) return null
  const error = entry.snapshot.error
  const status = entry.snapshot.status
  if (typeof error === "string" && error) return error
  return status ? `Status ${String(status)}` : "Refused"
}
