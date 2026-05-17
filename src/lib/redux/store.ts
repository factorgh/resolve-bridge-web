import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { userApi } from './api/userApi';
import { productApi } from './api/productApi';
import { applicationApi } from './api/applicationApi';
import { transactionApi } from './api/transactionApi';
import { documentApi } from './api/documentApi';
import uiReducer from './slices/uiSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
      [applicationApi.reducerPath]: applicationApi.reducer,
      [transactionApi.reducerPath]: transactionApi.reducer,
      [documentApi.reducerPath]: documentApi.reducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, productApi.middleware, applicationApi.middleware, transactionApi.middleware, documentApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
