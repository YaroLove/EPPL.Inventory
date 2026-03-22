import { configureStore } from '@reduxjs/toolkit';
import displayReducer from '../components/containers/displaySlice';
import loginReducer from '../loginSlice';
import userReducer from '../components/containers/userSlice';
import filterReducer from '../components/Items/filterSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { itemsApi } from '../services/items';
import { shoppingApi } from '../services/shopping';
import { aiApi } from '../services/ai';
import { categoriesApi } from '../services/categories';
import { suppliersApi } from '../services/suppliers';
import { fieldDefinitionsApi } from '../services/fieldDefinitions';
import { userApi } from '../services/userApi';
import { adminApi } from '../services/adminApi';
import { historyApi } from '../services/historyApi';

export const store = configureStore({
  reducer: {
    display: displayReducer,
    login: loginReducer,
    user: userReducer,
    filter: filterReducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [shoppingApi.reducerPath]: shoppingApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [suppliersApi.reducerPath]: suppliersApi.reducer,
    [fieldDefinitionsApi.reducerPath]: fieldDefinitionsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [historyApi.reducerPath]: historyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(itemsApi.middleware)
      .concat(shoppingApi.middleware)
      .concat(aiApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(suppliersApi.middleware)
      .concat(fieldDefinitionsApi.middleware)
      .concat(userApi.middleware)
      .concat(adminApi.middleware)
      .concat(historyApi.middleware),
});

setupListeners(store.dispatch);
