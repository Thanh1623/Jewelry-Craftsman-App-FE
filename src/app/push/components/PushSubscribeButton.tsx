import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useEnablePushMutation } from "../hooks/use-enable-push-mutation"

export function PushSubscribeButton() {
  const enablePushMutation = useEnablePushMutation()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-8 gap-1.5 rounded-full border-stone-200 bg-white text-xs text-stone-600 hover:bg-amber-50 hover:text-amber-900"
      onClick={() => enablePushMutation.mutate()}
      disabled={enablePushMutation.isPending}
    >
      <Bell className="size-3.5" />
      <span className="hidden sm:inline">
        {enablePushMutation.isPending ? "Đang bật..." : "Thông báo"}
      </span>
    </Button>
  )
}
