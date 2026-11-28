import {
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

import { PAGE_SIZES } from "@/components/data-table"

import { AUDIT_ACTIONS, AUDIT_OUTCOMES, AUDIT_SOURCES } from "../api/audit-log"

const filterParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsNumberLiteral(PAGE_SIZES).withDefault(20),
  source: parseAsStringLiteral(AUDIT_SOURCES),
  action: parseAsStringLiteral(AUDIT_ACTIONS),
  succeeded: parseAsStringLiteral(AUDIT_OUTCOMES),
  from: parseAsString,
  to: parseAsString,
  q: parseAsString,
  /** The entry open in the details sheet */
  entry: parseAsString,
}

/** Audit log filters and the open entry, kept in the URL like the other lists. */
export function useAuditLogFilters() {
  return useQueryStates(filterParsers, {
    clearOnDefault: true,
    history: "push",
  })
}
