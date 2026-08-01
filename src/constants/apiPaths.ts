export const apiPaths = {
  auth: "/auth",
  login: "/auth/login",
  register: "/auth/register",
  me: "/auth/me",
  requests: "/requests",
  requestDetail: (requestId: string) => `/requests/${requestId}`,
  requestAnswer: (requestId: string) => `/requests/${requestId}/answer`,
  pushVapidPublicKey: "/push/vapid-public-key",
  pushSubscribe: "/push/subscribe",
} as const
