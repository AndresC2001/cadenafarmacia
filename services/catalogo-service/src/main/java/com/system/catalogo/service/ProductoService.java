package com.system.catalogo.service;

import com.system.catalogo.model.Producto;
import com.system.catalogo.repository.ProductoRepository;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @PostConstruct
    void seedData() {
        if (productoRepository.count() == 0) {
            productoRepository.save(new Producto("Laptop", "Equipo portátil", 1200.0));
            productoRepository.save(new Producto("Mouse", "Mouse inalámbrico", 25.0));
            productoRepository.save(new Producto("Teclado", "Teclado mecánico", 80.0));
        }
    }

    public List<Producto> findAll() {
        return productoRepository.findAll();
    }

    public Optional<Producto> findById(Long id) {
        return productoRepository.findById(id);
    }

    public Producto create(Producto producto) {
        return productoRepository.save(producto);
    }

    public Optional<Producto> update(Long id, Producto producto) {
        return productoRepository.findById(id)
                .map(existing -> {
                    existing.setNombre(producto.getNombre());
                    existing.setDescripcion(producto.getDescripcion());
                    existing.setPrecio(producto.getPrecio());
                    return productoRepository.save(existing);
                });
    }

    public void delete(Long id) {
        productoRepository.deleteById(id);
    }
}
