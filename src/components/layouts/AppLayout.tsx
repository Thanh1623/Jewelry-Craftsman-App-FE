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
    <div className="min-h-svh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              Xưởng chế tác trang sức
            </span>
            <span className="text-xs text-muted-foreground">
              {user?.fullName ?? user?.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <PushSubscribeButton />
            <Button variant="outline" size="sm" onClick={logout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  )
}
