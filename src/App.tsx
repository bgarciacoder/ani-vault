import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './ui/Navbar';
import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import ProfilePage from './views/ProfilePage';
import { useAuth } from './state/auth/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isAuthReady } = useAuth();
  
  if (!isAuthReady) {
    return <div className="flex items-center justify-center h-96">Cargando...</div>;
  }
  
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <main className="container-app py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

