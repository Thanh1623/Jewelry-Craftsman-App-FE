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
      onClick={() => enablePushMutation.mutate()}
      disabled={enablePushMutation.isPending}
    >
      <Bell data-icon="inline-start" />
      {enablePushMutation.isPending ? "Đang bật..." : "Bật thông báo"}
    </Button>
  )
}
