# API de productos

API REST (Node.js + Express) conectada a PostgreSQL.

## Rutas
- GET /salud
- GET /productos
- GET /productos/:id
- POST /productos  (JSON: nombre, precio)
- PUT /productos/:id
- DELETE /productos/:id

## Ejecutar
1. Crear la tabla: `psql -h 127.0.0.1 -U apiuser -d apidb -f schema.sql`
2. `npm install`
3. `DB_PASSWORD=<contraseña> PORT=3001 npm start`

Variables: DB_HOST, DB_PORT, DB_USER, DB_NAME, DB_PASSWORD, PORT.
