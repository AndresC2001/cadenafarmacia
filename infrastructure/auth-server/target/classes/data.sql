INSERT INTO roles (id, name) VALUES (1, 'ROLE_ADMIN') ON CONFLICT DO NOTHING;
INSERT INTO roles (id, name) VALUES (2, 'ROLE_USER') ON CONFLICT DO NOTHING;

-- Cambia las inserciones por:
INSERT INTO users (id, username, password, enabled) VALUES (1, 'admin', 'admin123', true) ON CONFLICT DO NOTHING;
INSERT INTO users (id, username, password, enabled) VALUES (2, 'user', 'user123', true) ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES (1, 2) ON CONFLICT DO NOTHING;
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2) ON CONFLICT DO NOTHING;
