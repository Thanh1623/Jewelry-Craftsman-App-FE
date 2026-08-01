import { Navigate, Outlet } from "react-router-dom"

import { urlPaths } from "@/constants/urlPaths"
import { useAuthStore } from "@/stores/auth-store"

export function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (!accessToken) {
    return <Navigate to={urlPaths.login} replace />
  }

  return <Outlet />
}
