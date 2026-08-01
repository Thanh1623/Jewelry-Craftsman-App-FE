import { Navigate, Outlet } from "react-router-dom"
import { urlPaths } from "@/constants/urlPaths"
import { useAuthStore } from "@/stores/auth-store"

export function GuestRoute() {
  const accessToken = useAuthStore((state) => state.accessToken)

  if (accessToken) {
    return <Navigate to={urlPaths.home} replace />
  }

  return <Outlet />
}
