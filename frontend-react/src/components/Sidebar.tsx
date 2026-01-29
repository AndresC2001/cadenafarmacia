import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { logout } = useAuth();

  const navItems = [
    { id: 'catalogo', label: 'Medicamentos', category: 'Módulos de catálogo' },
    { id: 'inventario', label: 'Inventario', category: 'Inventario' },
    { id: 'ventas', label: 'Ventas', category: 'Ventas y análisis' },
  ];

  const categories = Array.from(new Set(navItems.map(item => item.category)));

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>FarmaApp System</h1>
      </div>
      
      <nav className="sidebar-nav">
        {categories.map(category => (
          <div key={category}>
            <p className="nav-label">{category}</p>
            {navItems
              .filter(item => item.category === category)
              .map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${activeSection === item.id ? 'is-active' : ''}`}
                  onClick={() => onSectionChange(item.id)}
                >
                  {item.label}
                </button>
              ))}
            <div className="nav-divider"></div>
          </div>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button className="nav-item logout" onClick={logout}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
