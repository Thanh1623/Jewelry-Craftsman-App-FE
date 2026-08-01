import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { getApiErrorMessage } from "@/lib/get-api-error-message"

import {
  fetchVapidPublicKeyRequest,
  subscribePushRequest,
} from "../services/push.service"
import { urlBase64ToUint8Array } from "../utils/url-base64-to-uint8array"

async function enablePushNotifications(): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    toast.error("Trình duyệt không hỗ trợ thông báo đẩy.")
    return false
  }

  const { publicKey } = await fetchVapidPublicKeyRequest()
  if (!publicKey) {
    toast.error("Chưa cấu hình VAPID.")
    return false
  }

  const permission = await Notification.requestPermission()
  if (permission !== "granted") {
    toast.error("Bạn đã từ chối quyền nhận thông báo.")
    return false
  }

  const registration = await navigator.serviceWorker.register("/sw.js")
  await navigator.serviceWorker.ready

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  })

  const { endpoint, keys } = subscription.toJSON() as {
    endpoint: string
    keys: { p256dh: string; auth: string }
  }

  await subscribePushRequest({ endpoint, keys })
  return true
}

export function useEnablePushMutation() {
  return useMutation({
    mutationFn: enablePushNotifications,
    onSuccess: (subscribed) => {
      if (subscribed) {
        toast.success("Đã bật thông báo cho yêu cầu mới.")
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Không thể bật thông báo."))
    },
  })
}
