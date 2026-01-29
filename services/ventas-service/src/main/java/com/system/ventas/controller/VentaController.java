package com.system.ventas.controller;

import com.system.ventas.model.Venta;
import com.system.ventas.service.VentaService;
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
@RequestMapping("/ventas")
public class VentaController {

    private final VentaService ventaService;

    public VentaController(VentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public List<Venta> list() {
        return ventaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> get(@PathVariable Long id) {
        return ventaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/detalle")
    public ResponseEntity<Map<String, Object>> getDetalle(@PathVariable Long id) {
        return ventaService.getVentaDetalle(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Venta> create(@RequestBody Venta venta) {
        Venta created = ventaService.create(venta);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venta> update(@PathVariable Long id, @RequestBody Venta venta) {
        return ventaService.update(id, venta)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ventaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
