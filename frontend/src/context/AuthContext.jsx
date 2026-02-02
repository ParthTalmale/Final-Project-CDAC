import { createContext, useContext, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    login as loginAction,
    logout as logoutAction,
    register as registerAction,
    initializeAuth,
    clearError,
    selectUser,
    selectIsAuthenticated,
    selectIsLoading,
    selectError,
    selectIsInitialized,
    selectPatientId,
    selectDoctorId,
    selectAdminId,
    selectUserRole,
    selectUserId,
} from "../store/slices/authSlice";

/**
 * Authentication Context
 * 
 * Provides authentication functionality throughout the application.
 * Works in conjunction with Redux for state management while providing
 * a clean, intuitive API through React Context.
 * 
 * Industry Standard Implementation:
 * - Context + Redux hybrid pattern for best of both worlds
 * - Context provides easy-to-use hooks
 * - Redux manages the actual state with middleware support
 * - Automatic auth initialization on app load
 * 
 * Usage:
 * const { user, login, logout, isLoading, error } = useAuthContext();
 * 
 * @author MediConnect Team
 */

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();

    // Select state from Redux store
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);
    const isInitialized = useSelector(selectIsInitialized);

    // Role-specific IDs
    const userId = useSelector(selectUserId);
    const patientId = useSelector(selectPatientId);
    const doctorId = useSelector(selectDoctorId);
    const adminId = useSelector(selectAdminId);
    const role = useSelector(selectUserRole);

    /**
     * Initialize authentication on app load
     * Checks if user has a valid token and refreshes user data
     */
    useEffect(() => {
        if (!isInitialized) {
            dispatch(initializeAuth());
        }
    }, [dispatch, isInitialized]);

    /**
     * Login user with email and password
     * 
     * @param {string} email - User's email address
     * @param {string} password - User's password
     * @returns {Promise<{success: boolean, error?: string}>} Login result
     */
    const login = useCallback(async (email, password) => {
        try {
            const result = await dispatch(loginAction({ email, password })).unwrap();
            return { success: true, user: result };
        } catch (error) {
            return { success: false, error };
        }
    }, [dispatch]);

    /**
     * Register a new patient
     * 
     * @param {object} patientData - Patient registration data
     * @returns {Promise<{success: boolean, error?: string}>} Registration result
     */
    const registerPatient = useCallback(async (patientData) => {
        try {
            const result = await dispatch(registerAction(patientData)).unwrap();
            return { success: true, message: result.message };
        } catch (error) {
            return { success: false, error };
        }
    }, [dispatch]);

    /**
     * Logout user
     * Clears all authentication data
     */
    const logout = useCallback(() => {
        dispatch(logoutAction());
    }, [dispatch]);

    /**
     * Clear authentication error
     */
    const clearAuthError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    /**
     * Get role-specific ID based on user role
     * 
     * @returns {number|null} The appropriate ID for the user's role
     */
    const getRoleSpecificId = useCallback(() => {
        if (!user) return null;

        switch (user.role) {
            case 'ROLE_PATIENT':
                return patientId;
            case 'ROLE_DOCTOR':
                return doctorId;
            case 'ROLE_ADMIN':
                return adminId;
            default:
                return userId;
        }
    }, [user, patientId, doctorId, adminId, userId]);

    /**
     * Check if user has a specific role
     * 
     * @param {string} checkRole - Role to check (e.g., 'PATIENT', 'DOCTOR', 'ADMIN')
     * @returns {boolean} True if user has the specified role
     */
    const hasRole = useCallback((checkRole) => {
        if (!user) return false;

        // Handle both 'PATIENT' and 'ROLE_PATIENT' formats
        const normalizedCheckRole = checkRole.startsWith('ROLE_')
            ? checkRole
            : `ROLE_${checkRole}`;

        return user.role === normalizedCheckRole;
    }, [user]);

    // Context value - all authentication-related data and functions
    const value = {
        // User data
        user,
        userId,
        patientId,
        doctorId,
        adminId,
        role,

        // Authentication status
        isAuthenticated,
        isLoading,
        isInitialized,
        error,

        // Actions
        login,
        logout,
        registerPatient,
        clearAuthError,

        // Utility functions
        getRoleSpecificId,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to access authentication context
 * 
 * @returns {object} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }

    return context;
};
