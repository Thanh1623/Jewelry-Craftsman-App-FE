export const apiPaths = {
  auth: "/auth",
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
  requests: "/requests",
  requestDetail: (requestId: string) => `/requests/${requestId}`,
  requestAnswer: (requestId: string) => `/requests/${requestId}/answer`,
  requestMessages: (requestId: string) => `/requests/${requestId}/messages`,
  uploadImage: "/uploads/image",
  pushVapidPublicKey: "/push/vapid-public-key",
  pushSubscribe: "/push/subscribe",
} as const
