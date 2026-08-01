export const urlPaths = {
  home: "/",
  login: "/login",
  register: "/register",
  requestDetail: (requestId: string) => `/requests/${requestId}`,
} as const
