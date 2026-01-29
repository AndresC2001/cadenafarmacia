import React, { useState } from 'react';
import { useCatalogo } from '../hooks/useCatalogo';
import { useAuth } from '../contexts/AuthContext';
import type { Producto } from '../types';
import { formatMoney } from '../utils/format';
import DataTable from './DataTable';
import Modal from './Modal';
import { Edit, Trash2, RefreshCw, Plus } from 'lucide-react';

const CatalogoSection: React.FC = () => {
  const { productos, isLoading, refetch, createProducto, updateProducto, deleteProducto } = useCatalogo();
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState<Partial<Producto>>({ nombre: '', descripcion: '', precio: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '', precio: 0 });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (action: 'create' | 'update') => {
    if (!formData.nombre || !formData.descripcion || !formData.precio) {
      alert('Completa todos los campos.');
      return;
    }

    try {
      if (action === 'create') {
        await createProducto(formData as Omit<Producto, 'id'>);
        alert('Producto creado');
      } else if (editingId) {
        await updateProducto({ id: editingId, producto: formData as Omit<Producto, 'id'> });
        alert('Producto actualizado');
      }
      resetForm();
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleEdit = (producto: Producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio
    });
    setEditingId(producto.id!);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setFormData({ nombre: '', descripcion: '', precio: 0 });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProducto(id);
        alert('Producto eliminado');
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
          <h3>Catálogo</h3>
          <p>Gestiona productos y su información básica.</p>
        </div>
        <div className="panel-actions">
          <button className="ghost" onClick={() => refetch()}>
            <RefreshCw size={16} />
            Actualizar listado
          </button>
          {isAdmin && (
            <button className="primary" onClick={handleCreate}>
              <Plus size={16} />
              Crear producto
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingId ? 'Editar Producto' : 'Crear Producto'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(editingId ? 'update' : 'create'); }} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nombre:</label>
            <input
              type="text"
              value={formData.nombre || ''}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Descripción:</label>
            <textarea
              value={formData.descripcion || ''}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full p-2 border rounded text-black"
              rows={3}
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Precio:</label>
            <input
              type="number"
              step="0.01"
              value={formData.precio || ''}
              onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
              required
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Categoría:</label>
            <input
              type="text"
              value={formData.categoria || ''}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
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
        title="Listado de productos"
        isEmpty={productos.length === 0}
        emptyMessage="No hay productos para mostrar."
        status={getStatus()}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            {isAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>{formatMoney(producto.precio)}</td>
              {isAdmin && (
                <td>
                  <div className="table-actions">
                    <button
                      className="ghost"
                      onClick={() => handleEdit(producto)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(producto.id!)}
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

export default CatalogoSection;
