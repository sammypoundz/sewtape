import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Measurements } from './pages/Measurements';
import { Reminders } from './pages/Reminders';
import { NewMeasurement } from './pages/NewMeasurement'; // ✅ Correct import
import { NewReminder } from './pages/NewReminder';       // ✅ Correct import

function PrivateRoute({ children }: { children: React.ReactNode }) { // ✅ Use React.ReactNode
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;