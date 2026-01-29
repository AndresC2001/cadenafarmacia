package com.system.inventario.service;

import com.system.inventario.client.CatalogClient;
import com.system.inventario.model.Inventario;
import com.system.inventario.repository.InventarioRepository;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class InventarioService {

    private final InventarioRepository inventarioRepository;
    private final CatalogClient catalogClient;

    public InventarioService(InventarioRepository inventarioRepository, CatalogClient catalogClient) {
        this.inventarioRepository = inventarioRepository;
        this.catalogClient = catalogClient;
    }

    @PostConstruct
    void seedData() {
        if (inventarioRepository.count() == 0) {
            inventarioRepository.save(new Inventario(1L, 12));
            inventarioRepository.save(new Inventario(2L, 40));
            inventarioRepository.save(new Inventario(3L, 18));
        }
    }

    public List<Inventario> findAll() {
        return inventarioRepository.findAll();
    }

    public Optional<Inventario> findByProductoId(Long productoId) {
        return inventarioRepository.findByProductoId(productoId);
    }

    public Inventario create(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }

    public Optional<Inventario> update(Long productoId, Inventario inventario) {
        return inventarioRepository.findByProductoId(productoId)
                .map(existing -> {
                    existing.setProductoId(inventario.getProductoId());
                    existing.setStock(inventario.getStock());
                    return inventarioRepository.save(existing);
                });
    }

    public boolean deleteByProductoId(Long productoId) {
        return inventarioRepository.findByProductoId(productoId)
                .map(existing -> {
                    inventarioRepository.delete(existing);
                    return true;
                }).orElse(false);
    }

    public Optional<Map<String, Object>> getDetalle(Long productoId) {
        Optional<Inventario> inventario = inventarioRepository.findByProductoId(productoId);
        if (inventario.isEmpty()) {
            return Optional.empty();
        }
        Map<String, Object> producto = catalogClient.getProducto(productoId);
        return Optional.of(Map.of(
                "producto", producto,
                "stock", inventario.get().getStock()
        ));
    }
}
