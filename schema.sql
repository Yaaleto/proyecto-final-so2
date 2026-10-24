CREATE TABLE IF NOT EXISTS productos (
  id serial PRIMARY KEY,
  nombre text NOT NULL,
  precio numeric(10,2) NOT NULL CHECK (precio >= 0)
);
