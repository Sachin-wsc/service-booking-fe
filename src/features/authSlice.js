import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../services/api";
import Cookies from "js-cookie";
import { decodeToken, getTokenFromCookie } from "../utils/tokenUtils";

// Register thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);

      return {
        message: response.data?.message || "Registration successful",
        userId: response.data?.user?.id || response.data?.userId,
        email: userData.email,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(loginData);
      const token = response.data?.token;

      if (!token) {
        return rejectWithValue("No token received from server");
      }

      Cookies.set("token", token, {
        expires: 7,
        secure: false,
        sameSite: "Lax",
      });

      const decodedToken = decodeToken(token);

      if (!decodedToken) {
        return rejectWithValue("Invalid token received");
      }

      return {
        token,
        user: decodedToken,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return { message: "Logged out successfully" };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// Initialize auth thunk
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      let token = Cookies.get("token");

      // Fallback method if js-cookie doesn't work
      if (!token) {
        token = getTokenFromCookie();
      }

      if (!token) {
        return rejectWithValue("No token found");
      }

      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        Cookies.remove("token");
        return rejectWithValue("Invalid token");
      }

      return {
        token,
        user: decodedToken,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  initializing: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      Cookies.remove("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.initializing = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.initializing = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.initializing = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Logout cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        Cookies.remove("token");
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        Cookies.remove("token");
      });
  },
});

export const { setUser, setToken, setIsAuthenticated, logout, clearError } =
  authSlice.actions;

export default authSlice.reducer;
