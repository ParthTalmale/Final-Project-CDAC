# 🏥 MedConnect – Hospital Management System (Frontend)

A modern, role-based Hospital Management System frontend built with **React + Vite + Bootstrap 5**.  
Supports **Patient**, **Doctor**, and **Admin** user experiences with protected dashboards and real-time appointment management.

---

## 🎯 Overview

MedConnect is a comprehensive healthcare management platform that streamlines patient care, doctor scheduling, and administrative operations. The frontend provides intuitive interfaces for all user roles with seamless role-based access control and data persistence.

> **⚠️ Current Status**: This is a **frontend-only prototype** with mock data and localStorage-based storage. No backend or database is currently integrated. See [Backend Integration Guide](#backend-integration-guide) for implementing production-ready API connectivity.

---

## ⚡ Quick Start (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# Navigate to http://localhost:5173
```

**First time using the app?** Use the demo credentials:
- Patient: `patient@example.com` / `patient123`
- Doctor: `doctor@example.com` / `doctor123`
- Admin: `admin@example.com` / `admin123`

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- Multi-role login system (Patient, Doctor, Admin)
- JWT token management with `jwt-decode`
- Role-based route protection with custom wrappers
- Persistent authentication using localStorage
- Auto-redirect based on user role

### 👥 **Patient Features**
- Dashboard with upcoming appointments and medical records
- Search and book doctors
- Appointment management (upcoming & past)
- Medical records and prescription history
- Emergency contact management
- Payment tracking and history

### 👨‍⚕️ **Doctor Features**
- Personal dashboard with appointment schedule
- Patient history and medical records access
- Prescription management and generation
- Appointment monitoring and updates

### 🛡️ **Admin Features**
- Comprehensive analytics and reporting
- Doctor management (add, edit, delete)
- Appointment monitoring dashboard
- System-wide statistics and insights

### 🎨 **UI/UX**
- Fully responsive design (Bootstrap 5)
- Consistent component library (Button, Card, Modal, Table, etc.)
- Theme context for dark/light mode support
- Custom Loader component for async operations
- Professional gradient designs

### ⚡ **Performance & State Management**
- Vite for fast development and optimized builds
- Context API for global state (Auth, Theme, App)
- Custom hooks for common operations
- API service abstraction for clean code
- Debouncing for search and input operations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19.2.0 with Vite 7.2.4 |
| **UI Library** | Bootstrap 5.3.8 + Icons |
| **Routing** | React Router v7.10.1 |
| **State Management** | Context API + Redux (react-redux) |
| **HTTP Client** | Axios 1.13.2 |
| **Authentication** | JWT (jwt-decode 4.0.0) + bcrypt |
| **Animations** | Motion 12.23.25 |
| **Notifications** | React Toastify 11.0.5 |
| **Build Tool** | Vite 7.2.4 |
| **Linting** | ESLint 9.39.1 |

---

## 📁 Project Structure

```
mediconnect-frontend/
├── src/
│   ├── components/
│   │   ├── admin/              # Admin-specific components
│   │   │   ├── AdminAnalytics.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── DoctorManagement.jsx
│   │   ├── common/             # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Table.jsx
│   │   ├── doctor/             # Doctor-specific components
│   │   │   ├── DoctorAppointment.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   └── Prescription.jsx
│   │   └── patient/            # Patient-specific components
│   │       ├── AppointmentCard.jsx
│   │       ├── EmergencyContact.jsx
│   │       ├── MedicalRecord.jsx
│   │       └── PatientDashboard.jsx
│   ├── context/                # Global state contexts
│   │   ├── AppContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.js          # Authentication hook
│   │   ├── useDebounce.js      # Debouncing hook
│   │   ├── useFetch.js         # Data fetching hook
│   │   └── useRoleBasedRedirect.js
│   ├── pages/
│   │   ├── admin/              # Admin pages
│   │   │   ├── AppointmentMonitor.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ManageDoctor.jsx
│   │   ├── auth/               # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── RegisterDoctor.jsx
│   │   │   └── RegisterPatient.jsx
│   │   ├── doctor/             # Doctor pages
│   │   │   ├── Appointment.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── PatientHistory.jsx
│   │   └── patient/            # Patient pages
│   │       ├── Dashboard.jsx
│   │       ├── EmergencyContact.jsx
│   │       ├── FindDoctors.jsx
│   │       ├── MedicalRecord.jsx
│   │       ├── MyAppointment.jsx
│   │       ├── PastAppointment.jsx
│   │       ├── Payments.jsx
│   │       └── UpcomingAssignment.jsx
│   ├── routing/                # Route protection wrappers
│   │   ├── AdminRoute.jsx
│   │   ├── DoctorRoute.jsx
│   │   ├── PatientRoute.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/               # API service layers
│   │   ├── adminsApi.js
│   │   ├── api.js              # Base Axios configuration
│   │   ├── authApi.js
│   │   ├── doctorApi.js
│   │   └── patientApi.js
│   ├── utils/                  # Utility functions
│   │   ├── constants.js
│   │   ├── formatDate.js
│   │   ├── roleRoutes.js
│   │   ├── storage.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── vite.config.js
├── eslint.config.js
├── index.html
└── README.md
```

### Folder Organization Guide

#### `components/` - Reusable UI Components
- **admin/** - Components exclusive to admin role
- **common/** - Shared components used across all roles
- **doctor/** - Components exclusive to doctor role
- **patient/** - Components exclusive to patient role

#### `pages/` - Full Page Views
- Organized by role, each page is a complete screen
- Maps to a specific route
- Combines multiple components

#### `context/` - Global State Providers
- **AuthContext** - User authentication and role
- **ThemeContext** - App theme (light/dark)
- **AppContext** - General app-wide state

#### `hooks/` - Custom React Hooks
- Reusable logic extracted into custom hooks
- Keeps components clean and maintainable
- Examples: `useAuth()`, `useFetch()`, `useDebounce()`

#### `services/` - API Integration
- API modules organized by role/feature
- `api.js` - Base Axios configuration
- Each module (`authApi.js`, `patientApi.js`, etc.) handles specific API calls

#### `utils/` - Helper Functions & Constants
- **constants.js** - App-wide constants
- **validators.js** - Input validation logic
- **storage.js** - LocalStorage management
- **formatDate.js** - Date formatting utilities

#### `routing/` - Route Protection
- Wrapper components that check user roles
- Prevents unauthorized access to pages
- Handles redirects to login/appropriate dashboard

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mediconnect-frontend

# Install dependencies
npm install
# or
yarn install

# Install Bootstrap (if not included)
npm install bootstrap bootstrap-icons
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will start at `http://localhost:5173` (or the next available port).

### Building for Production

```bash
npm run build
# or
yarn build
```

The optimized production build will be created in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
# or
yarn lint
```

---

## 🧪 Demo Credentials

Use these credentials to test the application:

### Patient Login
```
Email: patient@demo.com
Password: demo123

### Doctor Login
```
Email: doctor@demo.com
Password: demo123
```

### Admin Login
```
Email: admin@demo.com
Password: demo123
```

> ⚠️ **Note**: These are demo credentials for development/testing. Change them in production.

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root (if needed):

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=MedConnect
```

### Bootstrap Setup

Bootstrap is configured globally in `main.jsx`:

```javascript
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
```

---

## 📋 Command Cheat Sheet

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server (Hot reload) |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check for linting errors |
| `npm run lint -- --fix` | Auto-fix linting issues |

---

## 🏗️ Architecture Highlights

### Component Structure
- **Presentational Components**: Reusable UI components in `components/common/`
- **Feature Components**: Role-specific components in `components/{role}/`
- **Page Components**: Full-page views in `pages/{role}/`

### State Management
- **AuthContext**: Manages user authentication state and role
- **ThemeContext**: Handles dark/light mode preferences
- **AppContext**: Global application state

### Custom Hooks
- **useAuth()**: Access authentication state anywhere
- **useFetch()**: Simplified data fetching with loading states
- **useDebounce()**: Debounce input for search operations
- **useRoleBasedRedirect()**: Automatic role-based navigation

### API Integration
- Centralized Axios configuration in `services/api.js`
- Separate API modules for each role (`authApi.js`, `patientApi.js`, etc.)
- Token management and automatic retry logic

### Route Protection
- `ProtectedRoute`: Base wrapper for authenticated routes
- `PatientRoute`, `DoctorRoute`, `AdminRoute`: Role-specific wrappers
- Automatic redirect to login if not authenticated

---

## 💡 Development Tips & Best Practices

### Code Organization
- Keep components small and focused on a single responsibility
- Use custom hooks to share stateful logic across components
- Place shared utilities in the `utils/` folder
- Group related API calls in service modules

### State Management
- Use Context API for global state (Auth, Theme)
- Keep local component state for UI-specific data
- Use Redux for complex state if needed
- Always provide default values in contexts

### API Integration
- Use the `useFetch()` hook for GET requests
- Handle loading and error states properly
- Always show appropriate feedback to users (Loader, Toast notifications)
- Store tokens securely in localStorage

### Performance
- Use `useDebounce()` for search inputs to reduce API calls
- Lazy load components with React Router
- Optimize re-renders with proper dependency arrays
- Use Bootstrap responsive classes effectively

### Styling
- Use Bootstrap utility classes for consistency
- Define component-specific styles in corresponding CSS files
- Follow BEM naming convention for custom classes
- Test responsiveness on different screen sizes

---

## 🐛 Troubleshooting

### Accessing Auth State

```javascript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Using Custom Hooks

```javascript
import { useFetch } from './hooks/useFetch';

function DoctorList() {
  const { data: doctors, loading, error } = useFetch('/doctors');
  
  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  
  return <div>{/* render doctors */}</div>;
}
```

### API Calls

```javascript
import { patientApi } from './services/patientApi';

async function bookAppointment(appointmentData) {
  try {
    const response = await patientApi.post('/appointments', appointmentData);
    console.log('Appointment booked:', response.data);
  } catch (error) {
    console.error('Booking failed:', error);
  }
}
```

---

## 🔐 Authentication Flow

1. User enters credentials on Login page
2. Frontend sends credentials to backend API
3. Backend validates and returns JWT token
4. Token stored in localStorage and AuthContext
5. Token attached to all subsequent API requests
6. Routes protected by role-based wrappers
7. Auto-redirect to appropriate dashboard based on role

---

## 🎯 Available Routes

### Patient Routes
- `/patient/dashboard` - Patient dashboard
- `/patient/find-doctors` - Search and book doctors
- `/patient/my-appointments` - Upcoming appointments
- `/patient/past-appointments` - Appointment history
- `/patient/medical-records` - View medical records
- `/patient/prescriptions` - View prescriptions
- `/patient/payments` - Payment history
- `/patient/emergency-contact` - Emergency contacts

### Doctor Routes
- `/doctor/dashboard` - Doctor dashboard
- `/doctor/appointments` - Appointment schedule
- `/doctor/patient-history` - Patient history
- `/doctor/prescriptions` - Manage prescriptions

### Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/manage-doctors` - Doctor management
- `/admin/appointments` - Appointment monitoring
- `/admin/analytics` - System analytics

### Public Routes
- `/login` - Login page
- `/register/patient` - Patient registration
- `/register/doctor` - Doctor registration

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. **Port Already in Use**
```bash
# If port 5173 is already in use, Vite will use the next available port
# Or specify a custom port:
npm run dev -- --port 3000
```

#### 2. **Dependencies Not Installed**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 3. **Authentication Token Not Persisting**
- Check if localStorage is enabled in your browser
- Verify token is being stored: `localStorage.getItem('authToken')`
- Check browser DevTools → Application → Local Storage

#### 4. **API Calls Failing (CORS Error)**
- Ensure backend is running on the correct URL
- Check `VITE_API_BASE_URL` in `.env`
- Verify backend CORS settings allow frontend origin

#### 5. **Components Not Updating After State Change**
- Ensure you're not mutating state directly
- Check that dependencies array is correct in useEffect hooks
- Use React DevTools to inspect component state

#### 6. **Bootstrap Styles Not Applying**
- Verify Bootstrap imports in `main.jsx`:
  ```javascript
  import "bootstrap/dist/css/bootstrap.min.css";
  import "bootstrap/dist/js/bootstrap.bundle.min.js";
  ```
- Clear browser cache and rebuild: `npm run build`

#### 7. **Build Failing**
```bash
# Check for linting errors
npm run lint

# Fix common issues automatically
npm run lint -- --fix

# Rebuild
npm run build
```

#### 8. **Session Expires Too Quickly**
- Check token expiration settings in AuthContext
- Verify JWT token decode logic in `services/authApi.js`
- Consider implementing token refresh mechanism

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📊 Project Status

### Current Phase: Frontend Prototype (No Backend)

#### Current Implementation ✅
- [x] Role-based authentication system (frontend-only)
- [x] Protected route wrappers
- [x] Patient dashboard and profile
- [x] Doctor appointment scheduling
- [x] Admin analytics dashboard
- [x] Responsive UI with Bootstrap
- [x] Context API state management
- [x] Mock API service integration (localStorage-based)
- [x] Custom hooks (useAuth, useFetch, useDebounce)
- [x] Demo credentials for testing

#### Why It's Frontend-Only 🔍
This project was developed as a **frontend prototype** to demonstrate:
1. **UI/UX Design** - Complete responsive interface for all user roles
2. **State Management** - How authentication and data flow works
3. **Component Architecture** - Reusable, scalable component structure
4. **User Experience** - Mockup of the complete healthcare management workflow

**Data Persistence**: Currently uses `localStorage` to simulate data storage. All data resets on browser cache clear.

**Authentication**: Mock login system validates hardcoded credentials. No real JWT validation or token refresh.

#### Known Limitations ⚠️
- ❌ No real database - data stored in browser memory only
- ❌ No backend API - all requests are simulated
- ❌ No real authentication - credentials are hardcoded
- ❌ No data persistence between sessions
- ❌ No multi-device synchronization
- ❌ No email/SMS notifications
- ❌ No payment gateway integration
- ❌ No real-time updates between users

---

## 🔄 Backend Integration Guide

When ready to add a backend and database, follow these changes:

### Phase 1: Backend Setup Requirements
- [ ] Set up Node.js/Express backend (or preferred framework)
- [ ] Configure PostgreSQL/MongoDB database
- [ ] Implement real JWT authentication
- [ ] Set up CORS configuration for frontend

### Phase 2: Authentication Changes
**Current (Frontend-Only)**:
```javascript
// src/context/AuthContext.jsx
const login = (role, email, password) => {
  // Hardcoded validation
  if (email === 'patient@example.com' && password === 'patient123') {
    // Mock login
  }
};
```

**After Backend Integration**:
```javascript
// Call real backend API
const login = async (role, email, password) => {
  const response = await authApi.post('/auth/login', { role, email, password });
  const { token, user } = response.data;
  // Store real JWT token
  localStorage.setItem('authToken', token);
};
```

### Phase 3: API Service Changes
**Current (Mock Data)**:
```javascript
// src/services/patientApi.js
export const patientApi = {
  getDoctors: () => Promise.resolve({ data: mockDoctors }),
  bookAppointment: (data) => Promise.resolve({ data: { success: true } })
};
```

**After Backend Integration**:
```javascript
// src/services/patientApi.js
const instance = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
});

export const patientApi = {
  getDoctors: () => instance.get('/doctors'),
  bookAppointment: (data) => instance.post('/appointments', data)
};
```

### Phase 4: Data Flow Changes
- [ ] Replace localStorage with API calls for all CRUD operations
- [ ] Implement proper error handling for API failures
- [ ] Add API request/response interceptors for token refresh
- [ ] Implement loading states for async operations
- [ ] Add real-time updates (WebSockets/polling)

### Phase 5: Environment Configuration
**Create `.env` file**:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=MedConnect
VITE_JWT_EXPIRY=3600
```

**Update `.env.production`**:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Phase 6: Key Files to Modify
1. **`src/context/AuthContext.jsx`**
   - Replace mock login with API call
   - Implement token refresh logic
   - Add proper error handling

2. **`src/services/`** (All API modules)
   - Replace mock data with real API endpoints
   - Update axios configuration with base URL
   - Add authentication headers

3. **`src/hooks/useFetch.js`**
   - Integrate with real backend
   - Add token refresh on 401 errors
   - Implement proper cache invalidation

4. **`.env` configuration**
   - Add `VITE_API_BASE_URL`
   - Add backend timeout settings
   - Add feature flags

### Phase 7: Database Schema
**Tables to Create**:
```sql
-- Users (Patients, Doctors, Admins)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  role ENUM('PATIENT', 'DOCTOR', 'ADMIN'),
  createdAt TIMESTAMP
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  patientId UUID FOREIGN KEY,
  doctorId UUID FOREIGN KEY,
  appointmentDate TIMESTAMP,
  status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED')
);

-- Medical Records
CREATE TABLE medical_records (
  id UUID PRIMARY KEY,
  patientId UUID FOREIGN KEY,
  recordData JSON,
  createdAt TIMESTAMP
);

-- Prescriptions
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY,
  appointmentId UUID FOREIGN KEY,
  medications JSON,
  issuedAt TIMESTAMP
);
```

### Phase 8: Testing Checklist
- [ ] Test login with real credentials
- [ ] Verify token storage and refresh
- [ ] Test role-based access control
- [ ] Verify data persistence across sessions
- [ ] Test multi-device synchronization
- [ ] Load test with concurrent users
- [ ] Test error scenarios (network failure, invalid token)
- [ ] Security audit (SQL injection, XSS, CORS)

### Phase 9: Deployment Updates
- [ ] Update CORS settings on backend
- [ ] Set up proper SSL certificates
- [ ] Configure environment variables for production
- [ ] Set up CI/CD pipeline
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger/OpenAPI)

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Support & Contact

For issues, questions, or suggestions:
- Open an issue on the repository
- Contact the development team

---

**Last Updated**: December 2025  
**Version**: 0.0.0
