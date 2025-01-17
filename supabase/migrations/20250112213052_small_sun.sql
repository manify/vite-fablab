/*
  # Add FabLab inventory items and categories

  1. Categories
    - Adds unique constraint on category name
    - Creates 9 main equipment categories
  
  2. Items
    - Adds all FabLab equipment with proper categorization
    - Each item includes description, status, condition and location
*/

-- First ensure categories table has unique name constraint
ALTER TABLE categories ADD CONSTRAINT categories_name_key UNIQUE (name);

-- Create new categories
INSERT INTO categories (name, description) VALUES
  ('VR/AR Equipment', 'Virtual and augmented reality devices and accessories'),
  ('Cameras & Imaging', 'Cameras, microscopes, and imaging equipment'),
  ('Educational Kits', 'Educational and learning kits for students'),
  ('Computing Hardware', 'Computers, servers, and related hardware'),
  ('Cables & Adapters', 'Various cables, adapters, and connectors'),
  ('3D Printing Supplies', 'Materials and supplies for 3D printing'),
  ('Electronic Components', 'Electronic parts and components'),
  ('Tools & Equipment', 'Various tools and equipment'),
  ('Safety Equipment', 'Safety gear and protective equipment')
ON CONFLICT (name) DO NOTHING;

-- Insert items for each category
DO $$
DECLARE
  v_vr_category_id uuid;
  v_cameras_category_id uuid;
  v_edu_category_id uuid;
  v_computing_category_id uuid;
  v_cables_category_id uuid;
  v_printing_category_id uuid;
  v_electronics_category_id uuid;
  v_tools_category_id uuid;
  v_safety_category_id uuid;
BEGIN
  -- Get category IDs
  SELECT id INTO v_vr_category_id FROM categories WHERE name = 'VR/AR Equipment';
  SELECT id INTO v_cameras_category_id FROM categories WHERE name = 'Cameras & Imaging';
  SELECT id INTO v_edu_category_id FROM categories WHERE name = 'Educational Kits';
  SELECT id INTO v_computing_category_id FROM categories WHERE name = 'Computing Hardware';
  SELECT id INTO v_cables_category_id FROM categories WHERE name = 'Cables & Adapters';
  SELECT id INTO v_printing_category_id FROM categories WHERE name = '3D Printing Supplies';
  SELECT id INTO v_electronics_category_id FROM categories WHERE name = 'Electronic Components';
  SELECT id INTO v_tools_category_id FROM categories WHERE name = 'Tools & Equipment';
  SELECT id INTO v_safety_category_id FROM categories WHERE name = 'Safety Equipment';

  -- VR/AR Equipment
  INSERT INTO items (name, description, category_id, qr_code, status, condition, location) VALUES
    ('Kit casque virtuel', 'Complete VR headset kit', v_vr_category_id, 'item-vr-001', 'available', 'Good', 'VR Lab'),
    ('Casque de réalité virtuel DK2', 'Complete DK2 VR headset kit', v_vr_category_id, 'item-vr-002', 'available', 'Good', 'VR Lab'),
    ('Casque de réalité virtuelle', 'Standard VR headset', v_vr_category_id, 'item-vr-003', 'available', 'Good', 'VR Lab'),
    ('Masque de protection hygiéniques casque VR', 'Hygiene masks for VR headsets', v_safety_category_id, 'item-safety-001', 'available', 'New', 'Storage');

  -- Cameras & Imaging
  INSERT INTO items (name, description, category_id, qr_code, status, condition, location) VALUES
    ('Kit HD Caméra', 'Complete HD camera kit', v_cameras_category_id, 'item-cam-001', 'available', 'Excellent', 'Media Room'),
    ('Digital microscope', 'Digital microscope for detailed imaging', v_cameras_category_id, 'item-micro-001', 'available', 'Good', 'Lab 1'),
    ('Caméra 360', '360-degree camera', v_cameras_category_id, 'item-cam-002', 'available', 'Good', 'Media Room'),
    ('Caméra', 'Standard camera', v_cameras_category_id, 'item-cam-003', 'available', 'Good', 'Media Room');

  -- Educational Kits
  INSERT INTO items (name, description, category_id, qr_code, status, condition, location) VALUES
    ('Brainware starter kit', 'Starter kit for brainware experiments', v_edu_category_id, 'item-edu-001', 'available', 'New', 'Lab 2'),
    ('Educational robot kit', 'Complete educational robot kit', v_edu_category_id, 'item-edu-002', 'available', 'Good', 'Robotics Lab'),
    ('Kit rover', 'Complete rover kit', v_edu_category_id, 'item-edu-003', 'available', 'Good', 'Robotics Lab'),
    ('The Freescale cup', 'Freescale cup competition kit', v_edu_category_id, 'item-edu-004', 'available', 'Good', 'Competition Room');

  -- Computing Hardware
  INSERT INTO items (name, description, category_id, qr_code, status, condition, location) VALUES
    ('Serveur', 'Server unit', v_computing_category_id, 'item-srv-001', 'available', 'Good', 'Server Room'),
    ('Tablette', 'Tablet device', v_computing_category_id, 'item-tab-001', 'available', 'Good', 'Media Room'),
    ('Téléphone portable', 'Mobile phone', v_computing_category_id, 'item-phone-001', 'available', 'Good', 'Media Room'),
    ('Clavier', 'Keyboard', v_computing_category_id, 'item-kbd-001', 'available', 'Good', 'Computer Lab');

  -- Cables & Adapters
  INSERT INTO items (name, description, category_id, qr_code, status, condition, location) VALUES
    ('Cables d''alimentation', 'Power cables', v_cables_category_id, 'item-cable-001', 'available', 'Good', 'Storage'),
    ('Cables HDMI', 'HDMI cables', v_cables_category_id, 'item-cable-002', 'available', 'Good', 'Storage'),
    ('Adaptateur DVI', 'DVI adapter', v_cables_category_id, 'item-adpt-001', 'available', 'Good', 'Storage');

  -- 3D Printing Supplies
  INSERT INTO items (name, description, category_id, qr_code, status, condition, location) VALUES
    ('Hot end', '3D printer hot end', v_printing_category_id, 'item-3d-001', 'available', 'New', '3D Print Lab'),
    ('3D filaments', 'Various types and colors of 3D printing filaments', v_printing_category_id, 'item-3d-002', 'available', 'New', '3D Print Lab'),
    ('Buses', '3D printer nozzles', v_printing_category_id, 'item-3d-003', 'available', 'New', '3D Print Lab'),
    ('Objets imprimés 3D', 'Various 3D printed objects', v_printing_category_id, 'item-3d-004', 'available', 'Good', 'Display Room');

  -- Electronic Components
  INSERT INTO items (name, description, category_id, qr_code, status, condition, location) VALUES
    ('Capteur de mouvement', 'Motion sensor', v_electronics_category_id, 'item-elec-001', 'available', 'New', 'Electronics Lab'),
    ('AOP12', 'Operational amplifier', v_electronics_category_id, 'item-elec-002', 'available', 'New', 'Electronics Lab'),
    ('Diswitch', 'Digital switch', v_electronics_category_id, 'item-elec-003', 'available', 'New', 'Electronics Lab'),
    ('Bouton poussoir', 'Push button', v_electronics_category_id, 'item-elec-004', 'available', 'New', 'Electronics Lab'),
    ('Switch', 'Switch component', v_electronics_category_id, 'item-elec-005', 'available', 'New', 'Electronics Lab'),
    ('Ampli opérationnels', 'Operational amplifiers', v_electronics_category_id, 'item-elec-006', 'available', 'New', 'Electronics Lab'),
    ('Octocoupleurs', 'Optocouplers', v_electronics_category_id, 'item-elec-007', 'available', 'New', 'Electronics Lab'),
    ('Thermistance', 'Thermistor', v_electronics_category_id, 'item-elec-008', 'available', 'New', 'Electronics Lab'),
    ('Transformateurs', 'Various transformers', v_electronics_category_id, 'item-elec-009', 'available', 'New', 'Electronics Lab'),
    ('Bobines', 'Coils', v_electronics_category_id, 'item-elec-010', 'available', 'New', 'Electronics Lab'),
    ('Inducteur', 'Inductor (6mH)', v_electronics_category_id, 'item-elec-011', 'available', 'New', 'Electronics Lab');

  -- Tools & Equipment
  INSERT INTO items (name, description, category_id, qr_code, status, condition, location) VALUES
    ('Disques', 'Various discs', v_tools_category_id, 'item-tool-001', 'available', 'Good', 'Workshop'),
    ('Disques manuels', 'Manual discs', v_tools_category_id, 'item-tool-002', 'available', 'Good', 'Workshop'),
    ('Instrument électrique', 'Electrical instrument', v_tools_category_id, 'item-tool-003', 'available', 'Good', 'Workshop'),
    ('Produit de maintenance', 'Maintenance products', v_tools_category_id, 'item-tool-004', 'available', 'New', 'Storage');

END $$;