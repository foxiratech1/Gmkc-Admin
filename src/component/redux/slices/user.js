import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  tokens: JSON.parse(localStorage.getItem('tokens')) || '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action) => {
        state.tokens = action.payload;
        localStorage.setItem('tokens', JSON.stringify(state.tokens));
      },
  },
});

export const {
    setToken
} = userSlice.actions;

export const userReducer = userSlice.reducer;
