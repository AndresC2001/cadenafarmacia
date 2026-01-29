import { useState } from 'react';
import type { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import TokenPanel from './components/TokenPanel';
import CatalogoSection from './components/CatalogoSection';
import InventarioSection from './components/InventarioSection';
import VentasSection from './components/VentasSection';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [activeSection, setActiveSection] = useState('catalogo');

  const renderSection = () => {
    switch (activeSection) {
      case 'catalogo':
        return <CatalogoSection />;
      case 'inventario':
        return <InventarioSection />;
      case 'ventas':
        return <VentasSection />;
      default:
        return <CatalogoSection />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        renderSection={renderSection}
      />
    </QueryClientProvider>
  );
}

const AppContent = ({ activeSection, setActiveSection, renderSection }: AuthenticatedAppProps) => {
  return (
    <AuthProvider>
      <AuthenticatedApp 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        renderSection={renderSection}
      />
    </AuthProvider>
  );
}

interface AuthenticatedAppProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  renderSection: () => ReactElement;
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({ activeSection, setActiveSection, renderSection }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        {/* Fondo atractivo detrás del modal */}
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Elementos decorativos animados */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '150px',
            height: '150px',
            border: '3px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
            opacity: 0.4
          }} />
          <div style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            animation: 'float 4s ease-in-out infinite reverse',
            opacity: 0.3
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '20%',
            width: '80px',
            height: '80px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            animation: 'float 5s ease-in-out infinite',
            transform: 'rotate(45deg)',
            opacity: 0.5
          }} />
          
          {/* Contenido principal de bienvenida */}
          <div style={{
            textAlign: 'center',
            color: 'white',
            zIndex: 1,
            maxWidth: '600px',
            padding: '2rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(3rem, 6vw, 4.5rem)',
              fontWeight: '800',
              margin: '0 0 1rem',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              background: 'linear-gradient(45deg, #fff, rgba(255,255,255,0.8))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>FarmaApp</h1>
            <h2 style={{
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              fontWeight: '300',
              margin: '0 0 2rem',
              opacity: 0.9,
              lineHeight: '1.4'
            }}>Sistema de Gestión Farmacéutica</h2>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.8,
              lineHeight: '1.6',
              margin: '0'
            }}>
              Gestiona tu farmacia de manera eficiente con nuestro sistema integral
            </p>
          </div>
          
          {/* Estilos de animación */}
          <style>{
            `@keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }`
          }</style>
        </div>
        
        {/* Modal de Login */}
        <LoginScreen />
      </>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      <main className="content">
        <Header 
          title="Microservices System"
          subtitle="Demo simple para catálogo, inventario y ventas."
        />
        
        <TokenPanel />
        {renderSection()}
      </main>
    </div>
  );
};

export default App;
