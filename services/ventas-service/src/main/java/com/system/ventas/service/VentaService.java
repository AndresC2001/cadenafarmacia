package com.system.ventas.service;

import com.system.ventas.client.CatalogClient;
import com.system.ventas.client.InventoryClient;
import com.system.ventas.model.Venta;
import com.system.ventas.model.VentaDetalle;
import com.system.ventas.repository.VentaRepository;
import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final CatalogClient catalogClient;
    private final InventoryClient inventoryClient;

    public VentaService(VentaRepository ventaRepository, CatalogClient catalogClient, InventoryClient inventoryClient) {
        this.ventaRepository = ventaRepository;
        this.catalogClient = catalogClient;
        this.inventoryClient = inventoryClient;
    }

    @PostConstruct
    void seedData() {
        if (ventaRepository.count() == 0) {
            Venta venta = new Venta();
            venta.setCliente("Cliente Demo");
            venta.setFecha(LocalDateTime.now());
            venta.addDetalle(new VentaDetalle(1L, 1, 1200.0));
            venta.addDetalle(new VentaDetalle(2L, 2, 25.0));
            venta.setTotal(1250.0);
            ventaRepository.save(venta);
        }
    }

    public List<Venta> findAll() {
        return ventaRepository.findAll();
    }

    public Optional<Venta> findById(Long id) {
        return ventaRepository.findById(id);
    }

    public Venta create(Venta venta) {
        normalizeDetalles(venta);
        if (venta.getFecha() == null) {
            venta.setFecha(LocalDateTime.now());
        }
        return ventaRepository.save(venta);
    }

    public Optional<Venta> update(Long id, Venta venta) {
        return ventaRepository.findById(id)
                .map(existing -> {
                    existing.setCliente(venta.getCliente());
                    existing.setTotal(venta.getTotal());
                    existing.setFecha(venta.getFecha() != null ? venta.getFecha() : LocalDateTime.now());
                    existing.getDetalles().clear();
                    if (venta.getDetalles() != null) {
                        venta.getDetalles().forEach(existing::addDetalle);
                    }
                    return ventaRepository.save(existing);
                });
    }

    public void delete(Long id) {
        ventaRepository.deleteById(id);
    }

    public Optional<Map<String, Object>> getVentaDetalle(Long id) {
        return ventaRepository.findById(id)
                .map(venta -> Map.of(
                        "id", venta.getId(),
                        "cliente", venta.getCliente(),
                        "fecha", venta.getFecha(),
                        "total", venta.getTotal(),
                        "detalles", venta.getDetalles().stream().map(detalle -> Map.of(
                                "producto", catalogClient.getProducto(detalle.getProductoId()),
                                "inventario", inventoryClient.getInventarioDetalle(detalle.getProductoId()),
                                "cantidad", detalle.getCantidad(),
                                "precioUnitario", detalle.getPrecioUnitario()
                        )).collect(Collectors.toList())
                ));
    }

    private void normalizeDetalles(Venta venta) {
        if (venta.getDetalles() == null) {
            venta.setDetalles(new ArrayList<>());
        }
        venta.getDetalles().forEach(detalle -> detalle.setVenta(venta));
    }
}
