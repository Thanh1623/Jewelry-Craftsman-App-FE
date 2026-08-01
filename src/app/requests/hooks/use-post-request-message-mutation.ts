import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { requestKeys } from "../queries/request.keys"
import { postRequestMessageRequest } from "../services/request.service"
import type { PostRequestMessagePayload } from "../types/request.types"

export function usePostRequestMessageMutation(requestId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PostRequestMessagePayload) =>
      postRequestMessageRequest(requestId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(requestKeys.detail(requestId), data)
      queryClient.invalidateQueries({ queryKey: requestKeys.all })
      if (data.warning) {
        toast.warning(data.warning)
        return
      }
      if (data.status === "ANSWERED") {
        toast.success("Đã gửi trả lời về shop.")
        return
      }
      toast.success("Đã gửi tin nhắn.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không gửi được tin nhắn."))
    },
  })
}
