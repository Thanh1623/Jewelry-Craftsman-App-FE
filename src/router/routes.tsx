import { createBrowserRouter, Navigate } from "react-router-dom"
import { LoginPage } from "@/app/auth/components/LoginPage"
import { RegisterPage } from "@/app/auth/components/RegisterPage"
import { RequestDetailPage } from "@/app/requests/components/RequestDetailPage"
import { RequestsListPage } from "@/app/requests/components/RequestsListPage"
import { AppLayout } from "@/components/layouts/AppLayout"
import { AuthLayout } from "@/components/layouts/AuthLayout"
import { ProtectedRoute } from "@/components/layouts/ProtectedRoute"
import { urlPaths } from "@/constants/urlPaths"
import { GuestRoute } from "@/components/layouts/GuestRoute"

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: urlPaths.home, element: <RequestsListPage /> },
          { path: "/requests/:requestId", element: <RequestDetailPage /> },
        ],
      },
    ],
  },
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: urlPaths.login, element: <LoginPage /> },
          { path: urlPaths.register, element: <RegisterPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to={urlPaths.home} replace /> },
])
