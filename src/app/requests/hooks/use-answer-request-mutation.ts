import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { requestKeys } from "../queries/request.keys"
import { answerRequestRequest } from "../services/request.service"
import type { AnswerRequestPayload } from "../types/request.types"

export function useAnswerRequestMutation(requestId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AnswerRequestPayload) =>
      answerRequestRequest(requestId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(requestKeys.detail(requestId), data)
      queryClient.invalidateQueries({ queryKey: requestKeys.all })
      if (data.warning) {
        toast.warning(data.warning)
        return
      }
      toast.success("Đã gửi câu trả lời cho khách hàng.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Gửi câu trả lời thất bại."))
    },
  })
}
