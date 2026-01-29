import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import type { Producto } from '../types';

export const useCatalogo = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = !!apiService.getToken();

  const catalogoQuery = useQuery({
    queryKey: ['productos'],
    queryFn: () => apiService.getProductos(),
    enabled: isAuthenticated, // Solo ejecutar si está autenticado
    retry: 2,
  });

  const createProductoMutation = useMutation({
    mutationFn: (producto: Omit<Producto, 'id'>) => apiService.createProducto(producto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  const updateProductoMutation = useMutation({
    mutationFn: ({ id, producto }: { id: number; producto: Omit<Producto, 'id'> }) => 
      apiService.updateProducto(id, producto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  const deleteProductoMutation = useMutation({
    mutationFn: (id: number) => apiService.deleteProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  return {
    productos: catalogoQuery.data || [],
    isLoading: catalogoQuery.isLoading,
    error: catalogoQuery.error,
    refetch: catalogoQuery.refetch,
    createProducto: createProductoMutation.mutateAsync,
    updateProducto: updateProductoMutation.mutateAsync,
    deleteProducto: deleteProductoMutation.mutateAsync,
    isCreating: createProductoMutation.isPending,
    isUpdating: updateProductoMutation.isPending,
    isDeleting: deleteProductoMutation.isPending,
  };
};
