import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Copy } from 'lucide-react';

const LoginPanel: React.FC = () => {
  const { login, token } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('Ingresa usuario y contraseña.');
      return;
    }
    
    setIsLoading(true);
    try {
      await login(username, password);
      setUsername('');
      setPassword('');
    } catch (error) {
      alert(`Error al iniciar sesión: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToken = async () => {
    if (!token) {
      alert('No hay token para copiar.');
      return;
    }
    try {
      await navigator.clipboard.writeText(token);
      alert('Token copiado al portapapeles.');
    } catch (error) {
      alert('No se pudo copiar el token.');
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h3>Acceso</h3>
          <p>Inicia sesión para obtener el token automáticamente.</p>
        </div>
        <button 
          type="button" 
          className="primary" 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando...' : 'Obtener token'}
        </button>
      </div>
      
      <form onSubmit={handleLogin}>
        <div className="form-grid">
          <div>
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              placeholder="admin o user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="span-2">
            <label htmlFor="token">Token JWT</label>
            <textarea
              id="token"
              rows={2}
              readOnly
              placeholder="El token aparecerá aquí"
              value={token}
            />
          </div>
        </div>
      </form>
      
      <div className="button-row">
        <button 
          type="button" 
          className="ghost" 
          onClick={copyToken}
          disabled={!token}
        >
          <Copy size={16} />
          Copiar token
        </button>
      </div>
    </section>
  );
};

export default LoginPanel;
