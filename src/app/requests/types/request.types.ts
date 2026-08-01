export const REQUEST_STATUS = {
  PENDING: "PENDING",
  ANSWERED: "ANSWERED",
} as const

export type RequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS]

export interface CraftsmanRequest {
  id: string
  shopRequestId: string
  chatSessionId: string
  productId: string | null
  productName: string
  productWeightGrams: number
  productLaborCost: number
  productBaseSize: number | null
  question: string
  customerNote: string | null
  status: RequestStatus
  answer: string | null
  answeredById: string | null
  answeredAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginatedMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ListRequestsResponse {
  data: CraftsmanRequest[]
  meta: PaginatedMeta
}

export interface ListRequestsParams {
  status?: RequestStatus
  page?: number
  limit?: number
}

export interface AnswerRequestPayload {
  answer: string
}

export interface AnswerRequestResponse extends CraftsmanRequest {
  warning?: string
}
