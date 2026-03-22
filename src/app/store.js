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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(itemsApi.middleware)
      .concat(shoppingApi.middleware)
      .concat(aiApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(suppliersApi.middleware)
      .concat(fieldDefinitionsApi.middleware),
});

setupListeners(store.dispatch);
