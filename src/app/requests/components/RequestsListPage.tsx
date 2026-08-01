import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-base font-semibold">Yêu cầu từ shop</h1>
        <div className="flex gap-1.5">
          {STATUS_TABS.map((tab) => (
            <Button
              key={tab}
              type="button"
              size="sm"
              className="h-7 text-xs"
              variant={status === tab ? "default" : "outline"}
              onClick={() => setStatus(tab)}
            >
              {REQUEST_STATUS_LABEL[tab]}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {isPending && (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        )}

        {isError && (
          <p className="text-sm text-destructive">Không tải được yêu cầu.</p>
        )}

        {!isPending && !isError && data?.data.length === 0 && (
          <p className="border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
            Không có yêu cầu.
          </p>
        )}

        {data?.data.map((request) => (
          <button
            key={request.id}
            type="button"
            onClick={() => navigate(urlPaths.requestDetail(request.id))}
            className="flex items-center gap-2 border border-border bg-card p-2.5 text-left hover:bg-muted/40"
          >
            {request.productImageUrl ? (
              <img
                src={request.productImageUrl}
                alt={request.productName}
                className="size-12 shrink-0 object-cover"
              />
            ) : (
              <div className="size-12 shrink-0 bg-muted" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{request.productName}</p>
              <p className="line-clamp-1 text-xs text-muted-foreground">{request.question}</p>
              <p className="text-[11px] text-muted-foreground">
                {formatWeightGrams(request.productWeightGrams)} · {formatVnd(request.productLaborCost)} ·{" "}
                {formatDateTime(request.createdAt)}
              </p>
            </div>
            <RequestStatusBadge status={request.status} />
          </button>
        ))}
      </div>
    </div>
  )
}
