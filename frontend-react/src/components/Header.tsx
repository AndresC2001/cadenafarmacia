import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Panel de control</p>
        <h2>{title}</h2>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      <div className="session-status">
        <span className="status-pill">
          Roles activos: <strong>
            {isAuthenticated && user?.roles.length ? 
              user.roles.join(', ') : 
              'Sin sesión activa'
            }
          </strong>
        </span>
      </div>
    </header>
  );
};

export default Header;
