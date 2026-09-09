import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, apiErrorMessage } from '../api/client'
import type { IUser } from '../interfaces'

interface AuthState {
  user: IUser | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
}

export const fetchMe = createAsyncThunk<IUser>('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get<IUser>('/auth/me')
    return data
  } catch (e) {
    return rejectWithValue(apiErrorMessage(e, 'Not authenticated'))
  }
})

export const login = createAsyncThunk<IUser, { email: string; password: string }>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<IUser>('/auth/login', payload)
      return data
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e, 'Login failed'))
    }
  },
)

export const register = createAsyncThunk<IUser, { name?: string; email: string; password: string }>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post<IUser>('/auth/register', payload)
      return data
    } catch (e) {
      return rejectWithValue(apiErrorMessage(e, 'Registration failed'))
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout')
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    const pending = (state: AuthState) => {
      state.status = 'loading'
      state.error = null
    }
    builder
      .addCase(fetchMe.pending, pending)
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(fetchMe.rejected, (state) => {
        state.status = 'succeeded' // me checked — just no session
        state.user = null
      })
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) ?? 'Login failed'
      })
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = (action.payload as string) ?? 'Registration failed'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.status = 'idle'
        state.error = null
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
