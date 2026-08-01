import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { REQUEST_STATUS_LABEL } from "../utils/format-request"
import type { RequestStatus } from "../types/request.types"

export interface RequestStatusBadgeProps {
  status: RequestStatus
  className?: string
}

export function RequestStatusBadge({ status, className }: RequestStatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "h-5 rounded-full border-0 px-2 text-[10px] font-medium",
        status === "PENDING" && "bg-amber-100 text-amber-800 hover:bg-amber-100",
        status === "IN_PROGRESS" && "bg-sky-100 text-sky-800 hover:bg-sky-100",
        status === "ANSWERED" && "bg-stone-200/80 text-stone-600 hover:bg-stone-200/80",
        className
      )}
    >
      {REQUEST_STATUS_LABEL[status]}
    </Badge>
  )
}
