import { configureStore } from '@reduxjs/toolkit';
import userReducer from "@/slices/userSlice";
import notificationReducer from "@/slices/notificationSlice";
import chatReducer from "@/slices/chatSlice"


const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    chat: chatReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
