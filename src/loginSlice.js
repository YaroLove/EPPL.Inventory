import { createSlice } from '@reduxjs/toolkit';

const defaultSettings = {
  lowStockThreshold: 5,
  expirationWarningDays: 30,
  displayMode: 'cards',
};

const initialState = {
  loggedIn: false,
  email: '',
  displayName: '',
  role: '',
  tempPassword: false,
  settings: defaultSettings,
  favorites: [],
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      const { email, displayName, role, tempPassword, settings, favorites } = action.payload;
      state.loggedIn = true;
      state.email = email || '';
      state.displayName = displayName || email || 'User';
      state.role = role || 'user';
      state.tempPassword = tempPassword || false;
      state.settings = { ...defaultSettings, ...(settings || {}) };
      state.favorites = (favorites || []).map(f => (typeof f === 'object' ? f._id || String(f) : String(f)));
    },
    clearCurrentUser: () => ({ ...initialState }),
    updateFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    // Kept for any legacy code that still calls setLogin
    setLogin: (state, action) => {
      state.loggedIn = action.payload;
    },
  },
});

export const { setCurrentUser, clearCurrentUser, updateFavorites, updateSettings, setLogin } =
  loginSlice.actions;

export default loginSlice.reducer;
