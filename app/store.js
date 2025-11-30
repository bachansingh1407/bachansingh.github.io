
import { configureStore } from "@reduxjs/toolkit";
import mailSlice from "./slices/mailSlice";

export const store = configureStore({
  reducer: {
    mail:mailSlice,
  },
});
