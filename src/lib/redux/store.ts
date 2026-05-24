import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { productApi } from "./api/productApi";
import { applicationApi } from "./api/applicationApi";
import { transactionApi } from "./api/transactionApi";
import { documentApi } from "./api/documentApi";
import { auditApi } from "./api/auditApi";
import { billingApi } from "./api/billingApi";
import { institutionApi } from "./api/institutionApi";
import { regionApi } from "./api/regionApi";
import { notificationApi } from "./api/notificationApi";
import { analyticsApi } from "./api/analyticsApi";
import { chatApi } from "./api/chatApi";
import uiReducer from "./slices/uiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
      [applicationApi.reducerPath]: applicationApi.reducer,
      [transactionApi.reducerPath]: transactionApi.reducer,
      [documentApi.reducerPath]: documentApi.reducer,
      [auditApi.reducerPath]: auditApi.reducer,
      [billingApi.reducerPath]: billingApi.reducer,
      [institutionApi.reducerPath]: institutionApi.reducer,
      [regionApi.reducerPath]: regionApi.reducer,
      [notificationApi.reducerPath]: notificationApi.reducer,
      [analyticsApi.reducerPath]: analyticsApi.reducer,
      [chatApi.reducerPath]: chatApi.reducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        userApi.middleware,
        productApi.middleware,
        applicationApi.middleware,
        transactionApi.middleware,
        documentApi.middleware,
        auditApi.middleware,
        billingApi.middleware,
        institutionApi.middleware,
        regionApi.middleware,
        notificationApi.middleware,
        analyticsApi.middleware,
        chatApi.middleware,
      ),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
