import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff, User, Lock } from 'lucide-react';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa usuario y contraseña.');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(username, password);
    } catch (error) {
      setError(`Error al iniciar sesión: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '2rem'
  };

  const modalStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '20px',
    padding: '3rem 2.5rem',
    width: '100%',
    maxWidth: '400px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    textAlign: 'center' as const,
    animation: 'modalSlideIn 0.3s ease-out'
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const brandIconStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 0.5rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#6b7280',
    fontSize: '1rem',
    margin: '0 0 2rem'
  };



  // Estilos CSS para animación y responsive
  const modalAnimationStyles = `
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    
    @media (max-width: 768px) {
      .login-modal {
        margin: 1rem;
        padding: 2rem 1.5rem !important;
      }
    }
  `;

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const inputGroupStyle: React.CSSProperties = {
    position: 'relative'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem'
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '1rem',
    paddingLeft: '3rem',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    outline: 'none'
  };

  const inputIconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '1rem',
    color: '#9ca3af',
    zIndex: 1
  };

  const togglePasswordStyle: React.CSSProperties = {
    position: 'absolute',
    right: '1rem',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '6px',
    transition: 'all 0.2s ease'
  };

  const buttonStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '0.5rem',
    opacity: isLoading ? 0.7 : 1,
    transform: isLoading ? 'scale(0.98)' : 'scale(1)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  };

  const errorStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    border: '1px solid #fecaca',
    marginBottom: '1rem'
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '2rem',
    padding: '1.5rem',
    background: 'rgba(0, 0, 0, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.05)'
  };

  const credentialsStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: '#6b7280',
    textAlign: 'center'
  };

  const codeStyle: React.CSSProperties = {
    background: 'rgba(102, 126, 234, 0.1)',
    color: '#667eea',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontFamily: 'Monaco, Consolas, monospace'
  };

  return createPortal(
    <>
      <style>{modalAnimationStyles}</style>
      <div style={overlayStyle} className="login-overlay">
        <div style={modalStyle} className="login-modal">
          <div style={headerStyle}>
            <div style={brandIconStyle}>
              <LogIn size={32} color="white" />
            </div>
            <h1 style={titleStyle}>FarmaApp</h1>
            <p style={subtitleStyle}>Accede a tu cuenta para continuar</p>
          </div>

            <form onSubmit={handleLogin} style={formStyle}>
              {error && (
                <div style={errorStyle}>
                  {error}
                </div>
              )}
              
              <div style={inputGroupStyle}>
                <label htmlFor="username" style={labelStyle}>Usuario</label>
                <div style={inputWrapperStyle}>
                  <User size={20} style={inputIconStyle} />
                  <input
                    id="username"
                    type="text"
                    placeholder="admin o user"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
              
              <div style={inputGroupStyle}>
                <label htmlFor="password" style={labelStyle}>Contraseña</label>
                <div style={inputWrapperStyle}>
                  <Lock size={20} style={inputIconStyle} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={togglePasswordStyle}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                style={buttonStyle}
                disabled={isLoading}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    (e.target as HTMLElement).style.transform = 'translateY(0)';
                    (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                  }
                }}
              >
                {isLoading ? '🔄 Iniciando sesión...' : '🚀 Iniciar Sesión'}
              </button>
            </form>
            
            <div style={footerStyle}>
              <div style={credentialsStyle}>
                <p style={{ margin: '0 0 0.5rem', fontWeight: '600', color: '#374151' }}>
                  <strong>Credenciales de prueba:</strong>
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  Admin: <span style={codeStyle}>admin</span> / <span style={codeStyle}>password</span>
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  Usuario: <span style={codeStyle}>user</span> / <span style={codeStyle}>password</span>
                </p>
              </div>
            </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default LoginScreen;
