-- Table: tables
CREATE TABLE IF NOT EXISTS tables (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  status VARCHAR(16) DEFAULT 'Available',
  layout_x INT DEFAULT 0,
  layout_y INT DEFAULT 0,
  branch_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);
-- Add a CHECK constraint for status if you want to enforce allowed values
-- ALTER TABLE tables ADD CONSTRAINT status_check CHECK (status IN ('Available', 'Reserved', 'Occupied', 'Cleaning'));

-- Table: public.tables

-- ALTER TABLE public.tables DROP COLUMN IF EXISTS capacity;
-- ALTER TABLE public.tables DROP COLUMN IF EXISTS layout_x;
-- ALTER TABLE public.tables DROP COLUMN IF EXISTS layout_y;

ALTER TABLE public.tables
    ADD COLUMN IF NOT EXISTS capacity integer,
    ADD COLUMN IF NOT EXISTS layout_x integer DEFAULT 0,
    ADD COLUMN IF NOT EXISTS layout_y integer DEFAULT 0;

-- Optionally, restrict status values
-- ALTER TABLE public.tables ADD CONSTRAINT status_check CHECK (status IN ('Available', 'Reserved', 'Occupied', 'Cleaning'));

-- Table: reservations
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  table_id INT NOT NULL,
  reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(16) DEFAULT 'Active',
  party_size INT,
  branch_id INT,
  FOREIGN KEY (table_id) REFERENCES tables(id),
  FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);
-- Add a CHECK constraint for status if you want to enforce allowed values
-- ALTER TABLE reservations ADD CONSTRAINT status_check CHECK (status IN ('Active', 'Cancelled', 'Completed'));

-- Table: public.reservations

-- ALTER TABLE public.reservations DROP COLUMN IF EXISTS party_size;

ALTER TABLE public.reservations
    ADD COLUMN IF NOT EXISTS party_size integer;

-- Optionally, add reservation_time column for clarity (alias for reserved_at)
-- ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS reservation_time timestamp;

-- Optionally, add an index for faster lookups by table_id
CREATE INDEX IF NOT EXISTS idx_reservations_table_id ON public.reservations(table_id);
