import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

/**
 * Redux Store Configuration
 * 
 * Centralized state management for the MediConnect application.
 * Uses Redux Toolkit for simplified Redux setup with best practices.
 * 
 * Features:
 * - DevTools integration (development only)
 * - Middleware configuration
 * - Slice-based modular reducers
 * 
 * Store Structure:
 * - auth: Authentication state (user, tokens, loading states)
 * - (Add more slices as needed: appointments, notifications, etc.)
 * 
 * @author MediConnect Team
 */

const store = configureStore({
    reducer: {
        auth: authReducer,
        // Add more reducers here as the app grows:
        // appointments: appointmentsReducer,
        // notifications: notificationsReducer,
        // etc.
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore non-serializable values in certain action paths if needed
                ignoredActions: ['auth/login/fulfilled'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
