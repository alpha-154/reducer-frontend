import { configureStore } from '@reduxjs/toolkit';
import userReducer from "@/slices/userSlice";
import notificationReducer from "@/slices/notificationSlice";
import chatReducer from "@/slices/chatSlice"
import dailyTaskReducer from "@/slices/dailyTaskSlice";


const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    chat: chatReducer,
    dailyTask: dailyTaskReducer 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
