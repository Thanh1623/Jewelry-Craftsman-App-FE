import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"

import { requestsListQueryOptions } from "../queries/request.queries"
import { REQUEST_STATUS, type RequestStatus } from "../types/request.types"
import {
  formatDateTime,
  formatVnd,
  formatWeightGrams,
  REQUEST_STATUS_LABEL,
} from "../utils/format-request"
import { RequestStatusBadge } from "./RequestStatusBadge"

const STATUS_TABS: RequestStatus[] = [
  REQUEST_STATUS.PENDING,
  REQUEST_STATUS.ANSWERED,
]

export function RequestsListPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<RequestStatus>(REQUEST_STATUS.PENDING)

  const { data, isPending, isError } = useQuery(
    requestsListQueryOptions({ status })
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yêu cầu tư vấn</CardTitle>
        <CardDescription>
          Danh sách câu hỏi khách hàng gửi từ shop, cần thợ trả lời.
        </CardDescription>
        <div className="mt-2 flex gap-2">
          {STATUS_TABS.map((tab) => (
            <Button
              key={tab}
              type="button"
              size="sm"
              variant={status === tab ? "default" : "outline"}
              onClick={() => setStatus(tab)}
            >
              {REQUEST_STATUS_LABEL[tab]}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {isPending && (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        )}

        {isError && (
          <p className="text-sm text-destructive">
            Không thể tải danh sách yêu cầu. Vui lòng thử lại.
          </p>
        )}

        {!isPending && !isError && data?.data.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Không có yêu cầu nào ở trạng thái này.
          </p>
        )}

        {data?.data.map((request) => (
          <button
            key={request.id}
            type="button"
            onClick={() => navigate(urlPaths.requestDetail(request.id))}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent/60 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{request.productName}</span>
              <span className="line-clamp-1 text-sm text-muted-foreground">
                {request.question}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatWeightGrams(request.productWeightGrams)} · Công thợ{" "}
                {formatVnd(request.productLaborCost)} ·{" "}
                {formatDateTime(request.createdAt)}
              </span>
            </div>
            <RequestStatusBadge status={request.status} />
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
