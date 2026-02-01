import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerPatient, getCurrentUser, logoutUser } from '../../services/authApi';
import { getStoredUser, getToken } from '../../services/api';

/**
 * Authentication Redux Slice
 * 
 * Manages global authentication state including:
 * - User information (including role-specific IDs)
 * - Authentication status
 * - Loading states
 * - Error handling
 * 
 * Industry Standard Implementation:
 * - Async thunks for API calls
 * - Immutable state updates via Redux Toolkit
 * - Centralized auth state management
 * - Persistent auth state through localStorage
 * 
 * @author MediConnect Team
 */

// Initial state structure
const initialState = {
    // User information
    user: getStoredUser(), // Initialize from localStorage

    // Authentication status
    isAuthenticated: !!getToken(),

    // Loading states
    isLoading: false,
    isInitialized: false,

    // Error handling
    error: null,
};

/**
 * Async Thunk: Login
 * Handles user authentication and stores credentials
 */
export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        const result = await loginUser(email, password);

        if (!result.success) {
            return rejectWithValue(result.message);
        }

        return result.user;
    }
);

/**
 * Async Thunk: Register Patient
 * Handles patient self-registration
 */
export const register = createAsyncThunk(
    'auth/register',
    async (patientData, { rejectWithValue }) => {
        const result = await registerPatient(patientData);

        if (!result.success) {
            return rejectWithValue(result.message);
        }

        return result;
    }
);

/**
 * Async Thunk: Fetch Current User
 * Validates token and refreshes user data
 */
export const fetchCurrentUser = createAsyncThunk(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        const result = await getCurrentUser();

        if (!result.success) {
            return rejectWithValue(result.message);
        }

        return result.user;
    }
);

/**
 * Async Thunk: Initialize Auth
 * Called on app startup to check if user is already authenticated.
 * If we have both token and user data in storage, trust it without API call.
 * Only validate with API if we have token but no user data.
 */
export const initializeAuth = createAsyncThunk(
    'auth/initialize',
    async (_, { getState, rejectWithValue }) => {
        const token = getToken();
        const storedUser = getStoredUser();

        // No token = not authenticated
        if (!token) {
            return null;
        }

        // If we have both token and user data, trust the stored data
        // This avoids unnecessary API calls and race conditions after login
        if (storedUser && storedUser.userId && storedUser.role) {
            return storedUser;
        }

        // We have a token but no valid user data - validate with API
        try {
            const result = await getCurrentUser();

            if (!result.success) {
                // Token is invalid, clear storage
                logoutUser();
                return rejectWithValue('Session expired');
            }

            return result.user;
        } catch (error) {
            // API call failed - but don't log out if we have stored user data
            // This handles network errors gracefully
            if (storedUser) {
                return storedUser;
            }
            logoutUser();
            return rejectWithValue('Session expired');
        }
    }
);

// Create the auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Logout user
         * Clears all auth state and localStorage
         */
        logout: (state) => {
            logoutUser();
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },

        /**
         * Clear error state
         */
        clearError: (state) => {
            state.error = null;
        },

        /**
         * Update user data
         * Used when user profile is updated
         */
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.isInitialized = true; // Mark as initialized after successful login
                state.user = action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload || 'Login failed';
            })

            // Register cases
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
                // Don't set isAuthenticated - user needs to login after registration
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Registration failed';
            })

            // Fetch current user cases
            .addCase(fetchCurrentUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            })

            // Initialize auth cases
            .addCase(initializeAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(initializeAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isInitialized = true;
                if (action.payload) {
                    state.user = action.payload;
                    state.isAuthenticated = true;
                } else {
                    state.isAuthenticated = false;
                }
            })
            .addCase(initializeAuth.rejected, (state) => {
                state.isLoading = false;
                state.isInitialized = true;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

// Export actions
export const { logout, clearError, updateUser } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectIsInitialized = (state) => state.auth.isInitialized;

// Role-specific ID selectors
export const selectUserId = (state) => state.auth.user?.userId;
export const selectPatientId = (state) => state.auth.user?.patientId;
export const selectDoctorId = (state) => state.auth.user?.doctorId;
export const selectAdminId = (state) => state.auth.user?.adminId;
export const selectUserRole = (state) => state.auth.user?.role;

// Role check selectors
export const selectIsPatient = (state) => state.auth.user?.role === 'ROLE_PATIENT';
export const selectIsDoctor = (state) => state.auth.user?.role === 'ROLE_DOCTOR';
export const selectIsAdmin = (state) => state.auth.user?.role === 'ROLE_ADMIN';

export default authSlice.reducer;
