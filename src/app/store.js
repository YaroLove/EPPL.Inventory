import { configureStore } from '@reduxjs/toolkit';
import displayReducer from '../components/containers/displaySlice';
import loginReducer from '../loginSlice';
import userReducer from '../components/containers/userSlice';
import filterReducer from '../components/Items/filterSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { itemsApi } from '../services/items';
import { shoppingApi } from '../services/shopping';
import { aiApi } from '../services/ai';

export const store = configureStore({
  reducer: {
    display: displayReducer,
    login: loginReducer,
    user: userReducer,
    filter: filterReducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [shoppingApi.reducerPath]: shoppingApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(itemsApi.middleware, shoppingApi.middleware, aiApi.middleware),
});

setupListeners(store.dispatch);
