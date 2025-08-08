import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/auth-slice"
import donorReducer from "./features/donor-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    donors: donorReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
