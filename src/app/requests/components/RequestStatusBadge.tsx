import { Badge } from "@/components/ui/badge"

import { REQUEST_STATUS_LABEL } from "../utils/format-request"
import type { RequestStatus } from "../types/request.types"

export interface RequestStatusBadgeProps {
  status: RequestStatus
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  return (
    <Badge variant={status === "ANSWERED" ? "secondary" : "default"}>
      {REQUEST_STATUS_LABEL[status]}
    </Badge>
  )
}
