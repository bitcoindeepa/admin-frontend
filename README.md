# BitcoinDeepa-Admin-FE

Admin dashboard for BitcoinDeepa DCA. Vite + React + shadcn/ui, React Router (data mode), TanStack Query, nuqs.

## Setup

```bash
bun install
cp .env.example .env   # VITE_API_URL = BitcoinDeepa-DCA-BE URL
bun run dev
```

Sign-in uses the backend's Better Auth (`/api/admin-auth`). Only admins can sign in; create the first one on the backend with `bun run admin:create --email <email> --name "<name>"`, then add others from the **Admins** page.

## Connecting Claude (DB MCP)

The backend's admin sign-in is also the OAuth server of its read-only DB MCP (`POST /mcp`, backend `docs/mcp.md`). When an admin connects Claude, the backend sends them to `/login` (the sign-in continues the OAuth request: `oauthProviderClient()` in `auth-client.ts` sends the page's signed query along) and then to `/oauth/consent` to allow the client once. Both pages only act on a request the backend signed.

## Structure

```
src/
  app/          # providers, router, layouts, app-level pages
  features/     # one folder per feature: api/, components/, hooks/, pages/, index.ts
    auth/
    dashboard/
  components/   # shared: ui/ (shadcn), layout/ (sidebar, header), data-table/ (TanStack Table)
  hooks/ lib/   # shared hooks and helpers
```

Features import each other only through their `index.ts`.

## Tables

All tables use TanStack Table (v9) through `components/data-table`: `useDataTable` (server-side pagination), `DataTable`, `DataTablePagination` and `DataTableSearch`. Define columns per feature with `createColumnHelper<DataTableFeatures, Row>()` and keep filters/page in the URL with nuqs (see `features/members`).
