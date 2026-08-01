import { queryOptions } from "@tanstack/react-query"

import {
  fetchRequestByIdRequest,
  fetchRequestsRequest,
} from "../services/request.service"
import type { ListRequestsParams } from "../types/request.types"
import { requestKeys } from "./request.keys"

export function requestsListQueryOptions(params: ListRequestsParams) {
  return queryOptions({
    queryKey: requestKeys.list(params),
    queryFn: () => fetchRequestsRequest(params),
    // ponytail: shop→craftsman has no shared socket; poll so PENDING appears without manual refresh
    staleTime: 5_000,
    refetchInterval: 5_000,
    refetchOnWindowFocus: true,
  })
}

export function requestDetailQueryOptions(requestId: string) {
  return queryOptions({
    queryKey: requestKeys.detail(requestId),
    queryFn: () => fetchRequestByIdRequest(requestId),
    enabled: !!requestId,
    // ponytail: keep thread fresh while chatting
    refetchInterval: 8_000,
  })
}
