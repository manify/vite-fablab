/*
  # Set up authentication and initial data

  1. Changes
    - Add email confirmation trigger
    - Add default categories
    - Add sample inventory items
*/

-- Enable email confirmations for new users
ALTER TABLE auth.users
ENABLE ROW LEVEL SECURITY;

-- Add some default categories
INSERT INTO categories (name, description) VALUES
  ('3D Printers', 'Various 3D printing equipment'),
  ('Electronics', 'Electronic components and tools'),
  ('Hand Tools', 'Manual tools and equipment'),
  ('Power Tools', 'Electric and battery-powered tools'),
  ('Safety Equipment', 'Personal protective equipment');

-- Add some sample inventory items
INSERT INTO items (name, description, category_id, qr_code, status, condition, location) 
SELECT 
  '3D Printer - Prusa i3 MK3S+',
  'Original Prusa i3 MK3S+ 3D printer with multi-material upgrade',
  id,
  'item-3dprinter-001',
  'available',
  'Excellent',
  'Room 101'
FROM categories 
WHERE name = '3D Printers'
LIMIT 1;

INSERT INTO items (name, description, category_id, qr_code, status, condition, location)
SELECT 
  'Soldering Station',
  'Hakko FX-888D Digital Soldering Station',
  id,
  'item-solder-001',
  'available',
  'Good',
  'Room 102'
FROM categories 
WHERE name = 'Electronics'
LIMIT 1;

INSERT INTO items (name, description, category_id, qr_code, status, condition, location)
SELECT 
  'Screwdriver Set',
  'Professional 42-piece precision screwdriver set',
  id,
  'item-tools-001',
  'available',
  'New',
  'Room 103'
FROM categories 
WHERE name = 'Hand Tools'
LIMIT 1;