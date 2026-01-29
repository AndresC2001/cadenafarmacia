package com.system.ventas.client;

import java.util.Map;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class InventoryClient {

    private final RestTemplate restTemplate;
    private final String inventoryBaseUrl;

    public InventoryClient(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
        this.inventoryBaseUrl = System.getenv().getOrDefault("INVENTARIO_URL", "http://inventario-service:8082");
    }

    public Map<String, Object> getInventarioDetalle(Long productoId) {
        return restTemplate.getForObject(inventoryBaseUrl + "/inventario/" + productoId + "/detalle", Map.class);
    }
}
