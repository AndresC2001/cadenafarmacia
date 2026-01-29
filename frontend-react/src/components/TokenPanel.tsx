import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Copy, Eye, EyeOff } from 'lucide-react';

const TokenPanel: React.FC = () => {
  const { token, user, logout } = useAuth();
  const [showToken, setShowToken] = React.useState(false);

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

  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  return (
    <section className="panel token-panel">
      <div className="panel-header">
        <div>
          <h3>Sesión Activa</h3>
          <p>
            Usuario: <strong>{user?.username}</strong> | 
            Roles: <strong>{user?.roles.join(', ') || 'Sin roles'}</strong>
          </p>
        </div>
        <div className="panel-actions">
          <button className="danger" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      <div className="token-section">
        <div className="form-group">
          <label htmlFor="token">Token JWT</label>
          <div className="token-input-container">
            <textarea
              id="token"
              rows={3}
              readOnly
              placeholder="Token JWT aparecerá aquí"
              value={showToken ? token : token ? '•'.repeat(50) + '...' : ''}
              className="token-textarea"
            />
            <div className="token-controls">
              <button 
                type="button" 
                className="ghost token-control-btn" 
                onClick={toggleTokenVisibility}
                title={showToken ? 'Ocultar token' : 'Mostrar token'}
              >
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button 
                type="button" 
                className="ghost token-control-btn" 
                onClick={copyToken}
                disabled={!token}
                title="Copiar token"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TokenPanel;
