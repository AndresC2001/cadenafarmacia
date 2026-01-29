import React, { useState } from 'react';
import { useVentas } from '../hooks/useVentas';
import { useCatalogo } from '../hooks/useCatalogo';
import { useAuth } from '../contexts/AuthContext';
import type { Venta } from '../types';
import { formatMoney } from '../utils/format';
import DataTable from './DataTable';
import Modal from './Modal';
import { Edit, Trash2, RefreshCw, Plus } from 'lucide-react';

const VentasSection: React.FC = () => {
  const { ventas, isLoading, refetch, createVenta, updateVenta, deleteVenta } = useVentas();
  const { productos } = useCatalogo();
  const { isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    id: 0,
    cliente: '',
    productoId: 0,
    cantidad: 0,
    precio: 0
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetForm = () => {
    setFormData({
      id: 0,
      cliente: '',
      productoId: 0,
      cantidad: 0,
      precio: 0
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleCreate = () => {
    setFormData({
      id: 0,
      cliente: '',
      productoId: 0,
      cantidad: 0,
      precio: 0
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleProductSelect = (productoId: number) => {
    const producto = productos.find(p => p.id === productoId);
    if (producto) {
      setFormData({
        ...formData,
        productoId,
        precio: producto.precio
      });
    }
  };

  const handleSubmit = async (action: 'create' | 'update') => {
    if (!formData.cliente || !formData.productoId || !formData.cantidad || !formData.precio) {
      alert('Completa todos los campos.');
      return;
    }

    const ventaData: Omit<Venta, 'id'> = {
      cliente: formData.cliente,
      total: formData.cantidad * formData.precio,
      detalles: [{
        productoId: formData.productoId,
        cantidad: formData.cantidad,
        precioUnitario: formData.precio
      }]
    };

    try {
      if (action === 'create') {
        await createVenta(ventaData);
        alert('Venta registrada');
      } else if (editingId) {
        await updateVenta({ id: editingId, venta: ventaData });
        alert('Venta actualizada');
      }
      resetForm();
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleEdit = (venta: Venta) => {
    const detalle = venta.detalles?.[0];
    setFormData({
      id: venta.id!,
      cliente: venta.cliente,
      productoId: detalle?.productoId || 0,
      cantidad: detalle?.cantidad || 0,
      precio: detalle?.precioUnitario || 0
    });
    setEditingId(venta.id!);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta venta?')) {
      try {
        await deleteVenta(id);
        alert('Venta eliminada');
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
          <h3>Ventas</h3>
          <p>Consulta y registra ventas recientes.</p>
        </div>
        <div className="panel-actions">
          <button className="ghost" onClick={() => refetch()}>
            <RefreshCw size={16} />
            Actualizar ventas
          </button>
          {isAdmin && (
            <button className="primary" onClick={handleCreate}>
              <Plus size={16} />
              Registrar venta
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingId ? 'Editar Venta' : 'Registrar Venta'}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(editingId ? 'update' : 'create'); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Cliente:</label>
            <input
              type="text"
              value={formData.cliente}
              onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
              placeholder="Nombre del cliente"
              required
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Producto:</label>
            <select
              value={formData.productoId}
              onChange={(e) => handleProductSelect(Number(e.target.value))}
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', outline: 'none', backgroundColor: '#fff', transition: 'border-color 0.2s' }}
              required
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              <option value={0}>Selecciona un producto</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre} - {formatMoney(producto.precio)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Cantidad:</label>
              <input
                type="number"
                min="1"
                value={formData.cantidad || ''}
                onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) })}
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                required
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Precio Unitario:</label>
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
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)', padding: '1rem', borderRadius: '8px', border: '2px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', textAlign: 'center' }}>
              Total: {formatMoney((formData.cantidad || 0) * (formData.precio || 0))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: window.innerWidth < 640 ? 'column' : 'row', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              style={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', fontSize: '1rem' }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
            >
              {editingId ? '✅ Actualizar' : '🚀 Registrar'}
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
        title="Últimas ventas"
        isEmpty={ventas.length === 0}
        emptyMessage="No hay ventas registradas."
        status={getStatus()}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Items</th>
            <th>Total</th>
            {isAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td>{venta.id}</td>
              <td>{venta.cliente}</td>
              <td>{venta.detalles?.length || 0}</td>
              <td>{formatMoney(venta.total)}</td>
              {isAdmin && (
                <td>
                  <div className="table-actions">
                    <button
                      className="ghost"
                      onClick={() => handleEdit(venta)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(venta.id!)}
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

export default VentasSection;
