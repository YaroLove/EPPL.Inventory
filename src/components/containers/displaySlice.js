import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  display: { type: 'page', value: 'default' },
};

export const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    setDisplay: (state, action) => {
      if (typeof action.payload === 'string') {
        state.display = { type: 'page', value: action.payload };
      } else {
        state.display = action.payload;
      }
    },
  },
});

export const { setDisplay } = displaySlice.actions;

export default displaySlice.reducer;
