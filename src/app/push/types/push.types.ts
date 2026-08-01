export interface VapidPublicKeyResponse {
  publicKey: string
}

export interface PushSubscribePayload {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}
