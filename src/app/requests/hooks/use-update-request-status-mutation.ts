import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/get-api-error-message"

import { requestKeys } from "../queries/request.keys"
import { updateRequestStatusRequest } from "../services/request.service"
import type { RequestStatus } from "../types/request.types"

export function useUpdateRequestStatusMutation(requestId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: RequestStatus) =>
      updateRequestStatusRequest(requestId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all })
      toast.success("Đã cập nhật trạng thái.")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không cập nhật được trạng thái."))
    },
  })
}
