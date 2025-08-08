import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type AuthState = {
  isAuthenticated: boolean
  user: {
    email: string
  } | null
}

// Load initial state from localStorage if available
const loadState = (): AuthState => {
  if (typeof window !== "undefined") {
    const savedState = localStorage.getItem("authState")
    if (savedState) {
      return JSON.parse(savedState)
    }
  }
  return {
    isAuthenticated: false,
    user: null,
  }
}

const initialState: AuthState = loadState()

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string }>) => {
      state.isAuthenticated = true
      state.user = {
        email: action.payload.email,
      }
      // Save to localStorage
      localStorage.setItem("authState", JSON.stringify(state))
      // Set cookie with long expiration (1 year)
      document.cookie = "auth=true; path=/; max-age=31536000"
    },
    logout: (state) => {
      // Clear localStorage
      localStorage.removeItem("authState")
      // Clear the auth cookie
      document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      state.isAuthenticated = false
      state.user = null
    },
  },
})

export const { login, logout } = auth.actions
export default auth.reducer
