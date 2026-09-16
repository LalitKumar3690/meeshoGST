import { configureStore } from '@reduxjs/toolkit';
import gstReducer from './slices/gstSlice';

export const store = configureStore({
  reducer: {
    gst: gstReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
