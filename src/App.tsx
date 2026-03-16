import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SyncProvider } from './contexts/SyncContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Measurements } from './pages/Measurements';
import { Reminders } from './pages/Reminders';
import { NewMeasurement } from './pages/NewMeasurement';
import { NewReminder } from './pages/NewReminder';
import { EditMeasurement } from './pages/EditMeasurement'; // ✅ new edit page

// Protected route wrapper – redirects to login if not authenticated
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SyncProvider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F2937',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
              },
            }}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/measurements"
              element={
                <PrivateRoute>
                  <Measurements />
                </PrivateRoute>
              }
            />
            <Route
              path="/measurements/new"
              element={
                <PrivateRoute>
                  <NewMeasurement />
                </PrivateRoute>
              }
            />
            <Route
              path="/measurements/edit/:id"          // ✅ new edit route
              element={
                <PrivateRoute>
                  <EditMeasurement />
                </PrivateRoute>
              }
            />
            <Route
              path="/reminders"
              element={
                <PrivateRoute>
                  <Reminders />
                </PrivateRoute>
              }
            />
            <Route
              path="/reminders/new"
              element={
                <PrivateRoute>
                  <NewReminder />
                </PrivateRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </SyncProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;