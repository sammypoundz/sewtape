import React, { useEffect } from 'react';
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
import { EditMeasurement } from './pages/EditMeasurement';
import { EditReminder } from './pages/EditReminder';
import { Marketplace } from './pages/Marketplace';
import { Clients } from './pages/Clients';
import { LocalNotifications } from '@capacitor/local-notifications';
import { StatusBar, Style } from '@capacitor/status-bar';

// Protected route wrapper – redirects to login if not authenticated
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  // Request notification permissions when the app starts
  useEffect(() => {
    LocalNotifications.requestPermissions().then(result => {
      if (result.display === 'granted') {
        console.log('Notification permission granted');
      } else {
        console.warn('Notification permission not granted');
      }
    });
  }, []);

  // Configure status bar: white icons on dark background
  useEffect(() => {
    const setStatusBar = async () => {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#111827' });
    };
    setStatusBar();
  }, []);

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
              path="/measurements/edit/:id"
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
            <Route
              path="/reminders/edit/:id"
              element={
                <PrivateRoute>
                  <EditReminder />
                </PrivateRoute>
              }
            />
            {/* Placeholder routes */}
            <Route
              path="/marketplace"
              element={
                <PrivateRoute>
                  <Marketplace />
                </PrivateRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <PrivateRoute>
                  <Clients />
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