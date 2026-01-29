package com.system.auth.controller;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://136.109.71.196:3000", "http://136.109.71.196:3001", "http://localhost:3000", "http://localhost:3001"})
public class TokenController {

    private final AuthenticationManager authenticationManager;
    private final JwtEncoder jwtEncoder;
    private final AuthorizationServerSettings authorizationServerSettings;

    public TokenController(AuthenticationManager authenticationManager,
                           JwtEncoder jwtEncoder,
                           AuthorizationServerSettings authorizationServerSettings) {
        this.authenticationManager = authenticationManager;
        this.jwtEncoder = jwtEncoder;
        this.authorizationServerSettings = authorizationServerSettings;
    }

    @GetMapping(value = "/oauth2/token", produces = MediaType.TEXT_HTML_VALUE)
    public String tokenPage() {
        return """
                <!DOCTYPE html>
                <html lang="es">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Obtener token</title>
                  <style>
                    body { font-family: Arial, sans-serif; background:#f5f7fa; padding: 24px; }
                    .card { background:#fff; padding:16px; border-radius:12px; max-width:520px; margin:0 auto; box-shadow:0 6px 18px rgba(31,41,51,.1); }
                    input { width:100%; padding:10px; margin:8px 0 12px; border-radius:8px; border:1px solid #d9e2ec; }
                    button { padding:10px 16px; border:none; border-radius:6px; background:#2563eb; color:#fff; cursor:pointer; }
                    pre { background:#f0f4f8; padding:12px; border-radius:8px; overflow-x:auto; }
                    a { color:#2563eb; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <h2>Generar token</h2>
                    <p>Ingresa tus credenciales para generar un JWT y copiarlo.</p>
                    <label>Usuario</label>
                    <input id="username" placeholder="admin o user">
                    <label>Contraseña</label>
                    <input id="password" type="password" placeholder="••••••">
                    <button id="login">Obtener token</button>
                    <pre id="token-output">Token aparecerá aquí.</pre>
                    <p><strong>Roles:</strong> <span id="roles-output">-</span></p>
                    <a href="http://localhost:3000" target="_blank">Ir al sistema de gestión</a>
                  </div>
                  <script>
                    const button = document.getElementById('login');
                    const tokenOutput = document.getElementById('token-output');
                    const rolesOutput = document.getElementById('roles-output');
                    button.addEventListener('click', async () => {
                      tokenOutput.textContent = 'Generando...';
                      rolesOutput.textContent = '-';
                      const username = document.getElementById('username').value;
                      const password = document.getElementById('password').value;
                      try {
                        const response = await fetch('/api/token', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ username, password })
                        });
                        if (!response.ok) {
                          const message = await response.text();
                          throw new Error(message || 'No autorizado');
                        }
                        const data = await response.json();
                        tokenOutput.textContent = data.accessToken;
                        rolesOutput.textContent = (data.roles || []).join(', ');
                      } catch (error) {
                        tokenOutput.textContent = `Error: ${error.message}`;
                      }
                    });
                  </script>
                </body>
                </html>
                """;
    }

    @PostMapping("/token")
    public ResponseEntity<TokenResponse> token(@RequestBody TokenRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        Instant now = Instant.now();
        List<String> roles = authentication.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.toList());
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(authorizationServerSettings.getIssuer())
                .issuedAt(now)
                .expiresAt(now.plusSeconds(3600))
                .subject(authentication.getName())
                .claim("roles", roles)
                .build();
        Jwt jwt = jwtEncoder.encode(JwtEncoderParameters.from(claims));
        return ResponseEntity.ok(new TokenResponse(jwt.getTokenValue(), "Bearer", 3600, roles));
    }

    public record TokenRequest(String username, String password) {
    }

    public record TokenResponse(String accessToken, String tokenType, long expiresIn, List<String> roles) {
    }
}
