-- Add image_url and is_active columns to menu_items
ALTER TABLE menu_items
    ADD COLUMN IF NOT EXISTS image_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
