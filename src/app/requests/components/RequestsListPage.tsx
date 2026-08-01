import { useQuery } from "@tanstack/react-query"
import { InboxIcon, MessageCircleIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"
import { cn } from "@/lib/utils"

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
  const knownPendingIdsRef = useRef<Set<string> | null>(null)

  const { data, isPending, isError, dataUpdatedAt } = useQuery(
    requestsListQueryOptions({ status })
  )

  const pendingQuery = useQuery({
    ...requestsListQueryOptions({ status: REQUEST_STATUS.PENDING, limit: 20 }),
  })

  const pendingCount = pendingQuery.data?.meta.total ?? 0

  useEffect(() => {
    const pendingItems = pendingQuery.data?.data
    if (!pendingItems) {
      return
    }

    const nextIds = new Set(pendingItems.map((item) => item.id))
    const previousIds = knownPendingIdsRef.current

    if (previousIds === null) {
      knownPendingIdsRef.current = nextIds
      return
    }

    const newlyArrived = pendingItems.filter((item) => !previousIds.has(item.id))
    knownPendingIdsRef.current = nextIds

    if (newlyArrived.length === 0) {
      return
    }

    const first = newlyArrived[0]
    toast.info(
      newlyArrived.length === 1
        ? `Yêu cầu mới: ${first.productName}`
        : `${newlyArrived.length} yêu cầu mới từ shop`,
      {
        description: first.question,
        action: {
          label: "Xem",
          onClick: () => navigate(urlPaths.requestDetail(first.id)),
        },
      }
    )

    document.title = `(${nextIds.size}) Yêu cầu — Xưởng Bạc Ý`
  }, [pendingQuery.data, dataUpdatedAt, navigate])

  useEffect(() => {
    if (pendingCount === 0) {
      document.title = "Xưởng Bạc Ý"
      return
    }
    document.title = `(${pendingCount}) Yêu cầu — Xưởng Bạc Ý`
  }, [pendingCount])

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-stone-400 uppercase">Inbox</p>
          <h1 className="text-xl font-semibold tracking-tight text-stone-800">
            Yêu cầu từ shop
          </h1>
          <p className="mt-0.5 text-sm text-stone-500">
            Chat và trả lời tư vấn chế tác
          </p>
        </div>

        <div className="inline-flex rounded-full bg-white/80 p-1 ring-1 ring-stone-200/80 shadow-sm">
          {STATUS_TABS.map((tab) => {
            const active = status === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatus(tab)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition",
                  active
                    ? "bg-amber-500 text-white shadow-sm shadow-amber-500/25"
                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                )}
              >
                {REQUEST_STATUS_LABEL[tab]}
                {tab === REQUEST_STATUS.PENDING && pendingCount > 0 && (
                  <span
                    className={cn(
                      "tabular-nums rounded-full px-1.5 py-px text-[10px]",
                      active ? "bg-white/20" : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm shadow-stone-200/40">
        {isPending && (
          <div className="space-y-0 divide-y divide-stone-100 p-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="px-3 py-3">
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <p className="p-6 text-sm text-destructive">Không tải được yêu cầu.</p>
        )}

        {!isPending && !isError && data?.data.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <InboxIcon className="size-6" />
            </div>
            <p className="text-sm font-medium text-stone-700">
              {status === REQUEST_STATUS.PENDING
                ? "Chưa có yêu cầu chờ trả lời"
                : "Chưa có yêu cầu đã trả lời"}
            </p>
            <p className="max-w-xs text-xs text-stone-400">
              Khi sale gửi hỏi thợ, hội thoại sẽ hiện ở đây.
            </p>
          </div>
        )}

        {!!data?.data.length && (
          <ul className="divide-y divide-stone-100 overflow-y-auto">
            {data.data.map((request) => (
              <li key={request.id}>
                <button
                  type="button"
                  onClick={() => navigate(urlPaths.requestDetail(request.id))}
                  className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition hover:bg-amber-50/50"
                >
                  {request.productImageUrl ? (
                    <img
                      src={request.productImageUrl}
                      alt=""
                      className="size-12 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
                    />
                  ) : (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-400">
                      <MessageCircleIcon className="size-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-stone-800">
                        {request.productName}
                      </p>
                      {request.status === REQUEST_STATUS.PENDING && (
                        <span className="size-1.5 shrink-0 rounded-full bg-amber-500" />
                      )}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-stone-500">
                      {request.question}
                    </p>
                    <p className="mt-1 text-[11px] text-stone-400">
                      {formatWeightGrams(request.productWeightGrams)} ·{" "}
                      {formatVnd(request.productLaborCost)} ·{" "}
                      {formatDateTime(request.createdAt)}
                    </p>
                  </div>
                  <RequestStatusBadge status={request.status} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
