import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem'
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    width: '100%',
    maxWidth: '28rem',
    maxHeight: '90vh',
    overflowY: 'auto',
    margin: '0 auto'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    fontWeight: 600,
    color: '#374151',
    margin: 0
  };

  const buttonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '2.5rem',
    minHeight: '2.5rem'
  };

  const contentStyle: React.CSSProperties = {
    padding: '1.5rem'
  };

  const modalContent = (
    <div style={overlayStyle} onClick={handleBackdropClick}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{title}</h2>
          <button
            onClick={onClose}
            style={buttonStyle}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
              (e.target as HTMLElement).style.color = '#6b7280';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'transparent';
              (e.target as HTMLElement).style.color = '#9ca3af';
            }}
          >
            <X size={24} />
          </button>
        </div>
        <div style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;