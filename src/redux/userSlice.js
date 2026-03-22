import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  registeredUsers: [], // local cache for demo only
  currentUser: null,
  isAuthenticated: false,
  error: null,
  loading: false,
};

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await fetch('http://localhost:8080/api/auth/logout', { method: 'POST' });
  return null;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registeredUsers.push(action.payload.user || { ...action.meta.arg });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user || { ...action.meta.arg };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.currentUser = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.currentUser = null;
        state.error = null;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
