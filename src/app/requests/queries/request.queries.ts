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
    staleTime: 15_000,
  })
}

export function requestDetailQueryOptions(requestId: string) {
  return queryOptions({
    queryKey: requestKeys.detail(requestId),
    queryFn: () => fetchRequestByIdRequest(requestId),
    enabled: !!requestId,
  })
}
