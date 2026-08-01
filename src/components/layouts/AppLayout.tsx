import { useQuery } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"

import { meQueryOptions } from "@/app/auth/queries/auth.queries"
import { PushSubscribeButton } from "@/app/push/components/PushSubscribeButton"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth-store"

export function AppLayout() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  useQuery(meQueryOptions(!!accessToken))

  return (
    <div className="min-h-svh">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-2.5">
          <div>
            <p className="text-sm font-semibold">Xưởng Bạc Ý</p>
            <p className="text-xs text-muted-foreground">{user?.fullName ?? user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <PushSubscribeButton />
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={logout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-3">
        <Outlet />
      </main>
    </div>
  )
}
