import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { Venta } from '../types';

export const useVentas = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = !!apiService.getToken();

  const ventasQuery = useQuery({
    queryKey: ['ventas'],
    queryFn: () => apiService.getVentas(),
    enabled: isAuthenticated, // Solo ejecutar si está autenticado
    retry: 2,
  });

  const createVentaMutation = useMutation({
    mutationFn: (venta: Omit<Venta, 'id'>) => apiService.createVenta(venta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
  });

  const updateVentaMutation = useMutation({
    mutationFn: ({ id, venta }: { id: number; venta: Omit<Venta, 'id'> }) => 
      apiService.updateVenta(id, venta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
  });

  const deleteVentaMutation = useMutation({
    mutationFn: (id: number) => apiService.deleteVenta(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
  });

  return {
    ventas: ventasQuery.data || [],
    isLoading: ventasQuery.isLoading,
    error: ventasQuery.error,
    refetch: ventasQuery.refetch,
    createVenta: createVentaMutation.mutateAsync,
    updateVenta: updateVentaMutation.mutateAsync,
    deleteVenta: deleteVentaMutation.mutateAsync,
    isCreating: createVentaMutation.isPending,
    isUpdating: updateVentaMutation.isPending,
    isDeleting: deleteVentaMutation.isPending,
  };
};
