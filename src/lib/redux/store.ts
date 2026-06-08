import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import uiReducer from "./slices/uiSlice";

// Import all API slices to ensure they are evaluated and inject their endpoints
import "./api/authApi";
import "./api/userApi";
import "./api/productApi";
import "./api/applicationApi";
import "./api/transactionApi";
import "./api/documentApi";
import "./api/auditApi";
import "./api/billingApi";
import "./api/institutionApi";
import "./api/regionApi";
import "./api/notificationApi";
import "./api/analyticsApi";
import "./api/chatApi";
import "./api/subscriptionApi";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
