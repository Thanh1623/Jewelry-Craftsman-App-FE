import { Outlet } from "react-router-dom"
import { HammerIcon } from "lucide-react"

export function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-stone-100 via-amber-50/50 to-orange-50/60 p-4">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
          <HammerIcon className="size-5" />
        </div>
        <p className="text-lg font-semibold tracking-tight text-stone-800">Xưởng Bạc Ý</p>
        <p className="text-xs text-stone-500">Ứng dụng thợ chế tác</p>
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  )
}
