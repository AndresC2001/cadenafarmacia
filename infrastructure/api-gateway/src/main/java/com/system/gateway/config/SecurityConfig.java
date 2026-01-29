package com.system.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtGrantedAuthoritiesConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        // 1. Configurar el convertidor de autoridades (roles)
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName("roles");
        
        // Dejamos el prefijo vacío porque tus roles en el JWT ya son "ROLE_ADMIN" y "ROLE_USER"
        authoritiesConverter.setAuthorityPrefix(""); 

        // 2. Adaptar el convertidor a un entorno reactivo
        ReactiveJwtAuthenticationConverter jwtAuthenticationConverter = new ReactiveJwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(
                new ReactiveJwtGrantedAuthoritiesConverterAdapter(authoritiesConverter)
        );

        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/actuator/health", "/actuator/info").permitAll()
                        // Usamos hasAuthority con el nombre completo para evitar errores de prefijos
                        .pathMatchers(HttpMethod.GET, "/api/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/**").hasAuthority("ROLE_ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/**").hasAuthority("ROLE_ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/**").hasAuthority("ROLE_ADMIN")
                        .anyExchange().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter)))
                .build();
    }
}