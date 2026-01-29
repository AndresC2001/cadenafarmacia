import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { Inventario } from '../types';

export const useInventario = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = !!apiService.getToken();

  const inventarioQuery = useQuery({
    queryKey: ['inventario'],
    queryFn: () => apiService.getInventario(),
    enabled: isAuthenticated, // Solo ejecutar si está autenticado
    retry: 2,
  });

  const createInventarioMutation = useMutation({
    mutationFn: (inventario: Inventario) => apiService.createInventario(inventario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
    },
  });

  const updateInventarioMutation = useMutation({
    mutationFn: ({ productoId, inventario }: { productoId: number; inventario: Inventario }) => 
      apiService.updateInventario(productoId, inventario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
    },
  });

  const deleteInventarioMutation = useMutation({
    mutationFn: (productoId: number) => apiService.deleteInventario(productoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventario'] });
    },
  });

  return {
    inventario: inventarioQuery.data || [],
    isLoading: inventarioQuery.isLoading,
    error: inventarioQuery.error,
    refetch: inventarioQuery.refetch,
    createInventario: createInventarioMutation.mutateAsync,
    updateInventario: updateInventarioMutation.mutateAsync,
    deleteInventario: deleteInventarioMutation.mutateAsync,
    isCreating: createInventarioMutation.isPending,
    isUpdating: updateInventarioMutation.isPending,
    isDeleting: deleteInventarioMutation.isPending,
  };
};
