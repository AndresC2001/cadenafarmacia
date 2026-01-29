package com.system.inventario.client;

import java.util.Map;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class CatalogClient {

    private final RestTemplate restTemplate;
    private final String catalogBaseUrl;

    public CatalogClient(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
        this.catalogBaseUrl = System.getenv().getOrDefault("CATALOGO_URL", "http://catalogo-service:8081");
    }

    public Map<String, Object> getProducto(Long productoId) {
        return restTemplate.getForObject(catalogBaseUrl + "/productos/" + productoId, Map.class);
    }
}
