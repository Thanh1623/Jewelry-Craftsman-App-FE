import { useQuery } from "@tanstack/react-query"
import { InboxIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Skeleton } from "@/components/ui/skeleton"
import { urlPaths } from "@/constants/urlPaths"
import { cn } from "@/lib/utils"

import { useUpdateRequestStatusMutation } from "../hooks/use-update-request-status-mutation"
import { requestsListQueryOptions } from "../queries/request.queries"
import { REQUEST_STATUS, type CraftsmanRequest, type RequestStatus } from "../types/request.types"
import {
  formatDateTime,
  formatVnd,
  formatWeightGrams,
  REQUEST_STATUS_LABEL,
} from "../utils/format-request"
import { RequestStatusBadge } from "./RequestStatusBadge"

const COLUMNS: RequestStatus[] = [
  REQUEST_STATUS.PENDING,
  REQUEST_STATUS.IN_PROGRESS,
  REQUEST_STATUS.ANSWERED,
]

function KanbanCard({
  request,
  onOpen,
}: {
  request: CraftsmanRequest
  onOpen: () => void
}) {
  const claimMutation = useUpdateRequestStatusMutation(request.id)

  return (
    <article className="rounded-xl bg-white p-3 ring-1 ring-stone-200/80 shadow-sm">
      <button type="button" onClick={onOpen} className="w-full text-left">
        <div className="mb-2 flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium text-stone-800">
            {request.productName}
          </p>
          <RequestStatusBadge status={request.status} />
        </div>
        <p className="line-clamp-2 text-xs text-stone-500">{request.question}</p>
        <p className="mt-2 text-[11px] text-stone-400">
          {formatWeightGrams(request.productWeightGrams)} ·{" "}
          {formatVnd(request.productLaborCost)} · {formatDateTime(request.createdAt)}
        </p>
      </button>
      {request.status === REQUEST_STATUS.PENDING && (
        <button
          type="button"
          className="mt-2 w-full rounded-lg bg-amber-600 px-2 py-1.5 text-[11px] font-medium tracking-wide text-white uppercase hover:bg-amber-700 disabled:opacity-60"
          disabled={claimMutation.isPending}
          onClick={() => claimMutation.mutate(REQUEST_STATUS.IN_PROGRESS)}
        >
          Nhận việc
        </button>
      )}
    </article>
  )
}

export function RequestsListPage() {
  const navigate = useNavigate()
  const knownPendingIdsRef = useRef<Set<string> | null>(null)

  const pendingQuery = useQuery(
    requestsListQueryOptions({ status: REQUEST_STATUS.PENDING, limit: 50 })
  )
  const progressQuery = useQuery(
    requestsListQueryOptions({ status: REQUEST_STATUS.IN_PROGRESS, limit: 50 })
  )
  const doneQuery = useQuery(
    requestsListQueryOptions({ status: REQUEST_STATUS.ANSWERED, limit: 50 })
  )

  const byStatus: Record<RequestStatus, CraftsmanRequest[]> = {
    PENDING: pendingQuery.data?.data ?? [],
    IN_PROGRESS: progressQuery.data?.data ?? [],
    ANSWERED: doneQuery.data?.data ?? [],
  }

  const pendingCount = pendingQuery.data?.meta.total ?? 0

  useEffect(() => {
    const pendingItems = pendingQuery.data?.data
    if (!pendingItems) return

    const nextIds = new Set(pendingItems.map((item) => item.id))
    const previousIds = knownPendingIdsRef.current

    if (previousIds === null) {
      knownPendingIdsRef.current = nextIds
      return
    }

    const newlyArrived = pendingItems.filter((item) => !previousIds.has(item.id))
    knownPendingIdsRef.current = nextIds

    if (newlyArrived.length === 0) return

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
  }, [pendingQuery.data, pendingQuery.dataUpdatedAt, navigate])

  useEffect(() => {
    document.title =
      pendingCount === 0 ? "Xưởng Bạc Ý" : `(${pendingCount}) Yêu cầu — Xưởng Bạc Ý`
  }, [pendingCount])

  const isPending =
    pendingQuery.isPending || progressQuery.isPending || doneQuery.isPending
  const isError = pendingQuery.isError || progressQuery.isError || doneQuery.isError

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div>
        <p className="text-[11px] tracking-[0.16em] text-stone-400 uppercase">Kanban</p>
        <h1 className="text-xl font-semibold tracking-tight text-stone-800">
          Bảng việc xưởng
        </h1>
        <p className="mt-0.5 text-sm text-stone-500">
          Chờ nhận → Đang làm → Hoàn thành (ảnh tiến độ trong chat)
        </p>
      </div>

      {isError && (
        <p className="text-sm text-destructive">Không tải được yêu cầu.</p>
      )}

      <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-3">
        {COLUMNS.map((status) => (
          <section
            key={status}
            className={cn(
              "flex min-h-[320px] flex-col rounded-2xl p-3",
              status === "PENDING" && "bg-amber-50/70 ring-1 ring-amber-100",
              status === "IN_PROGRESS" && "bg-sky-50/70 ring-1 ring-sky-100",
              status === "ANSWERED" && "bg-stone-100/80 ring-1 ring-stone-200/70"
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-xs font-semibold tracking-wide text-stone-700 uppercase">
                {REQUEST_STATUS_LABEL[status]}
              </h2>
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-stone-500 ring-1 ring-stone-200/80">
                {byStatus[status].length}
              </span>
            </div>

            {isPending && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            )}

            {!isPending && byStatus[status].length === 0 && (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-2 py-10 text-center">
                <InboxIcon className="size-6 text-stone-300" />
                <p className="text-xs text-stone-400">Trống</p>
              </div>
            )}

            <div className="flex flex-col gap-2 overflow-y-auto">
              {byStatus[status].map((request) => (
                <KanbanCard
                  key={request.id}
                  request={request}
                  onOpen={() => navigate(urlPaths.requestDetail(request.id))}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
