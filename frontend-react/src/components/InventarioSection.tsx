import React, { useState } from 'react';
import { useInventario } from '../hooks/useInventario';
import { useAuth } from '../contexts/AuthContext';
import type { Inventario } from '../types';
import DataTable from './DataTable';
import Modal from './Modal';
import { Edit, Trash2, RefreshCw, Plus } from 'lucide-react';

const InventarioSection: React.FC = () => {
  const { inventario, isLoading, refetch, createInventario, updateInventario, deleteInventario } = useInventario();
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState<Inventario>({ productoId: 0, stock: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setFormData({ productoId: 0, stock: 0 });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (action: 'create' | 'update') => {
    if (!formData.productoId || formData.stock < 0) {
      alert('Completa todos los campos correctamente.');
      return;
    }

    try {
      if (action === 'create') {
        await createInventario(formData);
        alert('Inventario creado');
      } else if (editingId) {
        await updateInventario({ productoId: editingId, inventario: formData });
        alert('Inventario actualizado');
      }
      resetForm();
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleEdit = (item: Inventario) => {
    setFormData({
      productoId: item.productoId,
      stock: item.stock
    });
    setEditingId(item.productoId);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setFormData({ productoId: 0, stock: 0 });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (productoId: number) => {
    if (confirm('¿Estás seguro de eliminar este inventario?')) {
      try {
        await deleteInventario(productoId);
        alert('Inventario eliminado');
      } catch (error) {
        alert(`Error: ${(error as Error).message}`);
      }
    }
  };

  const getStatus = () => {
    if (isLoading) return 'Cargando...';
    return `Actualizado: ${new Date().toLocaleTimeString('es-EC')}`;
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h3>Inventario</h3>
          <p>Consulta existencias y ajusta el stock.</p>
        </div>
        <div className="panel-actions">
          <button className="ghost" onClick={() => refetch()}>
            <RefreshCw size={16} />
            Actualizar inventario
          </button>
          {isAdmin && (
            <button className="primary" onClick={handleCreate}>
              <Plus size={16} />
              Crear inventario
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingId ? 'Editar Inventario' : 'Crear Inventario'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(editingId ? 'update' : 'create'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>ID Producto:</label>
            <input
              type="number"
              value={formData.productoId || ''}
              onChange={(e) => setFormData({ ...formData, productoId: Number(e.target.value) })}
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', outline: 'none', opacity: editingId ? 0.6 : 1, transition: 'border-color 0.2s' }}
              disabled={!!editingId}
              required
              onFocus={(e) => !editingId && (e.target.style.borderColor = '#667eea')}
              onBlur={(e) => !editingId && (e.target.style.borderColor = '#e5e7eb')}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Stock:</label>
            <input
              type="number"
              min="0"
              value={formData.stock || ''}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
              required
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: window.innerWidth < 640 ? 'column' : 'row', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              style={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1rem' }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
            >
              {editingId ? '✅ Actualizar' : '🚀 Crear'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              style={{ flex: window.innerWidth < 640 ? 1 : 'initial', background: '#6b7280', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1rem' }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#4b5563'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = '#6b7280'}
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </Modal>

      <DataTable
        title="Stock disponible"
        isEmpty={inventario.length === 0}
        emptyMessage="No hay inventario para mostrar."
        status={getStatus()}
      >
        <thead>
          <tr>
            <th>ID producto</th>
            <th>Stock</th>
            {isAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {inventario.map((item) => (
            <tr key={item.productoId}>
              <td>{item.productoId}</td>
              <td>{item.stock}</td>
              {isAdmin && (
                <td>
                  <div className="table-actions">
                    <button
                      className="ghost"
                      onClick={() => handleEdit(item)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(item.productoId)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </DataTable>
    </section>
  );
};

export default InventarioSection;
