import type { RequestStatus } from "../types/request.types"

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  PENDING: "Chờ nhận",
  IN_PROGRESS: "Đang làm",
  ANSWERED: "Hoàn thành",
}

export function formatWeightGrams(grams: number): string {
  return `${grams.toLocaleString("vi-VN")} g`
}

export function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + " đ"
}

export function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  })
}
