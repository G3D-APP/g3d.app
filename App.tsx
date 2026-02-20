import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { Calculators } from './pages/Calculators';
import { Settings } from './pages/Settings';
import { Sellers } from './pages/Sellers';
import { Inventory } from './pages/Inventory';
import { Market } from './pages/Market';
import { Login } from './pages/Login';

// Componente para proteger rutas privadas (Dashboard, Pedidos, etc.)
// Si NO hay usuario, manda al Login.
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

// Componente para rutas públicas (Login)
// Si YA hay usuario, manda al Dashboard.
const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const { currentUser } = useStore();
  if (currentUser) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

// Componente para proteger rutas solo de Admin
const AdminRoute = ({ children }: { children?: React.ReactNode }) => {
  const { currentUser } = useStore();
  if (!currentUser || currentUser.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          {/* RUTA PRINCIPAL PÚBLICA: MARKET */}
          {/* Layout envuelve al Market solo si hay usuario para mostrar el sidebar, 
              si no hay usuario, el Layout renderiza children directo (ver Layout.tsx) */}
          <Route path="/" element={
             <Layout>
               <Market />
             </Layout>
          } />

          {/* Login Público */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          {/* RUTA PRIVADA PRINCIPAL: DASHBOARD */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />

          <Route path="/calculators" element={
            <ProtectedRoute>
              <Calculators />
            </ProtectedRoute>
          } />

          <Route path="/inventory" element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } />

          {/* Market también accesible como ruta explícita */}
          <Route path="/market" element={<Navigate to="/" replace />} />

          <Route path="/sellers" element={
            <ProtectedRoute>
              <Sellers />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <AdminRoute>
                <Settings />
              </AdminRoute>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="p-8 text-white">
                <h1 className="text-2xl mb-4">Perfil de Usuario</h1>
                <p>Módulo de estadísticas personales en construcción.</p>
              </div>
            </ProtectedRoute>
          } />

          {/* Cualquier ruta desconocida redirige al Market */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}