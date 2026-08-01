import { useQuery } from "@tanstack/react-query"
import { HammerIcon } from "lucide-react"
import { Outlet, useLocation } from "react-router-dom"

import { meQueryOptions } from "@/app/auth/queries/auth.queries"
import { PushSubscribeButton } from "@/app/push/components/PushSubscribeButton"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

export function AppLayout() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const location = useLocation()
  const isChat = location.pathname.startsWith("/requests/")

  useQuery(meQueryOptions(!!accessToken))

  return (
    <div className="flex h-svh flex-col bg-gradient-to-br from-stone-100 via-amber-50/40 to-orange-50/50">
      {!isChat && (
        <header className="z-20 shrink-0 border-b border-stone-200/80 bg-white/75 backdrop-blur-md">
          <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between gap-3 px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-500/25">
                <HammerIcon className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-stone-800">
                  Xưởng Bạc Ý
                </p>
                <p className="truncate text-[11px] text-stone-500">
                  {user?.fullName ?? user?.email}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <PushSubscribeButton />
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full border-stone-200 bg-white text-xs text-stone-600"
                onClick={logout}
              >
                Đăng xuất
              </Button>
            </div>
          </div>
        </header>
      )}

      <main
        className={cn(
          "mx-auto flex w-full min-h-0 flex-1 flex-col",
          isChat ? "max-w-3xl" : "max-w-3xl px-4 py-4"
        )}
      >
        <Outlet />
      </main>
    </div>
  )
}
