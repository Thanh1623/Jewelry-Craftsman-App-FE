import type { ListRequestsParams } from "../types/request.types"

export const requestKeys = {
  all: ["requests"] as const,
  list: (params: ListRequestsParams) =>
    [...requestKeys.all, "list", params] as const,
  detail: (requestId: string) =>
    [...requestKeys.all, "detail", requestId] as const,
}
