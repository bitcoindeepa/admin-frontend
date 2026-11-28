import { createBrowserRouter, Navigate } from "react-router"

import { AdminsPage } from "@/features/admins"
import {
  ConsentPage,
  LoginPage,
  redirectIfSignedIn,
  requireAdmin,
} from "@/features/auth"
import { BankReviewsPage } from "@/features/bank-reviews"
import { DashboardPage } from "@/features/dashboard"
import { MembersPage } from "@/features/members"
import { TransactionsPage } from "@/features/transactions"

import { AppLayout } from "./layouts/app-layout"
import { LoadingScreen } from "./loading-screen"
import { RootLayout } from "./layouts/root-layout"
import { NotFoundPage } from "./not-found-page"

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    HydrateFallback: LoadingScreen,
    children: [
      { path: "/login", loader: redirectIfSignedIn, Component: LoginPage },
      // The backend's OAuth server (DB MCP) asks a signed-in admin to approve a client here
      { path: "/oauth/consent", loader: requireAdmin, Component: ConsentPage },
      {
        path: "/",
        loader: requireAdmin,
        Component: AppLayout,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          {
            path: "dashboard",
            Component: DashboardPage,
            handle: { title: "Dashboard" },
          },
          {
            path: "transactions",
            Component: TransactionsPage,
            handle: { title: "Transactions" },
          },
          {
            path: "members",
            Component: MembersPage,
            handle: { title: "Members" },
          },
          {
            path: "bank-reviews",
            Component: BankReviewsPage,
            handle: { title: "Bank Reviews" },
          },
          {
            path: "admins",
            Component: AdminsPage,
            handle: { title: "Admins" },
          },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
])
