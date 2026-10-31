// API paths for the application
// Ex:port paths for authentication
// export const API_PATHS = {
//   LOGIN: "/api/auth/login",
//   LOGOUT: "/api/auth/logout",
// };

export const API_ROUTES = {
  ADMIN: {
    PAYMENT: {
      CREATE: "/api/payment/create",
      QR_IMAGE: (url: string) => `/api/payment/qr-image?url=${url}`,
    },

    ORDER: {
      CREATE: "/api/orders",
    },
  },
};
