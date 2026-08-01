import { apiPaths } from "@/constants/apiPaths"
import { httpService } from "@/services/httpService"

import type {
  AnswerRequestPayload,
  AnswerRequestResponse,
  CraftsmanRequest,
  ListRequestsParams,
  ListRequestsResponse,
  PostRequestMessagePayload,
  RequestStatus,
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
): Promise<CraftsmanRequest & { messages: NonNullable<CraftsmanRequest["messages"]> }> {
  const { data } = await httpService.get<
    CraftsmanRequest & { messages: NonNullable<CraftsmanRequest["messages"]> }
  >(apiPaths.requestDetail(requestId))
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

export async function postRequestMessageRequest(
  requestId: string,
  payload: PostRequestMessagePayload
): Promise<AnswerRequestResponse> {
  const { data } = await httpService.post<AnswerRequestResponse>(
    apiPaths.requestMessages(requestId),
    payload
  )
  return data
}

export async function updateRequestStatusRequest(
  requestId: string,
  status: RequestStatus
): Promise<CraftsmanRequest> {
  const { data } = await httpService.patch<CraftsmanRequest>(
    apiPaths.requestStatus(requestId),
    { status }
  )
  return data
}

export async function uploadImageRequest(file: File): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await httpService.post<{ url: string }>(
    apiPaths.uploadImage,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  )
  return data
}
