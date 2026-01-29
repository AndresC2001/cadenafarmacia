package com.system.inventario.controller;

import com.system.inventario.model.Inventario;
import com.system.inventario.service.InventarioService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/inventario")
public class InventarioController {

    private final InventarioService inventarioService;

    public InventarioController(InventarioService inventarioService) {
        this.inventarioService = inventarioService;
    }

    @GetMapping
    public List<Inventario> list() {
        return inventarioService.findAll();
    }

    @GetMapping("/{productoId}")
    public ResponseEntity<Inventario> getByProducto(@PathVariable Long productoId) {
        return inventarioService.findByProductoId(productoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{productoId}/detalle")
    public ResponseEntity<Map<String, Object>> getDetalle(@PathVariable Long productoId) {
        return inventarioService.getDetalle(productoId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Inventario> create(@RequestBody Inventario inventario) {
        Inventario created = inventarioService.create(inventario);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{productoId}")
    public ResponseEntity<Inventario> update(@PathVariable Long productoId, @RequestBody Inventario inventario) {
        return inventarioService.update(productoId, inventario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{productoId}")
    public ResponseEntity<Void> delete(@PathVariable Long productoId) {
        boolean deleted = inventarioService.deleteByProductoId(productoId);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
