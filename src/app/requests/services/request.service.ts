import { apiPaths } from "@/constants/apiPaths"
import { httpService } from "@/services/httpService"

import type {
  AnswerRequestPayload,
  AnswerRequestResponse,
  CraftsmanRequest,
  ListRequestsParams,
  ListRequestsResponse,
} from "../types/request.types"

export async function fetchRequestsRequest(
  params: ListRequestsParams
): Promise<ListRequestsResponse> {
  const { data } = await httpService.get<ListRequestsResponse>(
    apiPaths.requests,
    { params }
  )
  return data
}

export async function fetchRequestByIdRequest(
  requestId: string
): Promise<CraftsmanRequest> {
  const { data } = await httpService.get<CraftsmanRequest>(
    apiPaths.requestDetail(requestId)
  )
  return data
}

export async function answerRequestRequest(
  requestId: string,
  payload: AnswerRequestPayload
): Promise<AnswerRequestResponse> {
  const { data } = await httpService.post<AnswerRequestResponse>(
    apiPaths.requestAnswer(requestId),
    payload
  )
  return data
}
