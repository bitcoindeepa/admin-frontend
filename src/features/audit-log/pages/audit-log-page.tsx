import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import {
  DataTable,
  DataTablePagination,
  PAGE_SIZES,
  useDataTable,
  type PageSize,
} from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { auditLogQueryOptions } from "../api/audit-log"
import { auditLogColumns } from "../components/audit-log-columns"
import { AuditEntrySheet } from "../components/audit-entry-sheet"
import { AuditLogFilters } from "../components/audit-log-filters"
import { useAuditLogFilters } from "../hooks/use-audit-log-filters"

/**
 * Who did what as an admin: dashboard requests, sign-ins, MCP client
 * consents and DB MCP queries (backend audit_log).
 */
export function AuditLogPage() {
  const [{ entry: entryId, ...filters }, setFilters] = useAuditLogFilters()
  const { data, isPending, isError, error, isPlaceholderData } = useQuery(
    auditLogQueryOptions(filters)
  )
  const columns = useMemo(
    () => auditLogColumns((entry) => void setFilters({ entry: entry.id })),
    [setFilters]
  )

  const table = useDataTable({
    data: data?.items ?? [],
    columns,
    getRowId: (entry) => entry.id,
    pagination: {
      page: filters.page,
      pageSize: filters.pageSize,
      total: data?.total ?? 0,
      onChange: ({ page, pageSize }) =>
        void setFilters(
          pageSize !== filters.pageSize
            ? {
                pageSize: PAGE_SIZES.includes(pageSize as PageSize)
                  ? (pageSize as PageSize)
                  : null,
                page: null,
              }
            : { page }
        ),
    },
  })

  const selected = data?.items.find((item) => item.id === entryId) ?? null
  const pastLastPage = data && data.items.length === 0 && data.total > 0

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <AuditLogFilters />
      <Card>
        <CardContent className="flex flex-col gap-4">
          {isPending ? (
            <Skeleton className="h-96 w-full" />
          ) : isError ? (
            <p className="text-sm text-destructive">
              Couldn&apos;t load the audit log: {error.message}
            </p>
          ) : (
            <>
              <DataTable
                table={table}
                dimmed={isPlaceholderData}
                emptyMessage={
                  pastLastPage ? (
                    <div className="flex flex-col items-center gap-2">
                      This page is empty.
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => void setFilters({ page: null })}
                      >
                        Go to first page
                      </Button>
                    </div>
                  ) : (
                    "Nothing in the audit log matches these filters"
                  )
                }
              />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>
      <AuditEntrySheet
        entry={selected}
        onClose={() => void setFilters({ entry: null })}
      />
    </div>
  )
}
