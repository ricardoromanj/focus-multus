-- Focus Multus Seed Data
-- Run this after schema.sql

-- Insert test users
INSERT INTO users (name, email, current_credits) VALUES
  ('Alex Rivera', 'alex@example.com', 10),
  ('Jordan Kim', 'jordan@example.com', 10),
  ('Sam Taylor', 'sam@example.com', 10);

-- Insert rooms (Englewood, CO themed)
INSERT INTO rooms (name, capacity, room_type) VALUES
  ('Pike''s Peak', 2, 'focus'),
  ('Bear Creek', 2, 'focus'),
  ('Red Rocks', 1, 'focus'),
  ('Lookout Mountain', 6, 'conference'),
  ('Gothic Theatre', 8, 'conference'),
  ('Platte River', 10, 'conference'),
  ('Hampden Hall', 12, 'conference');

-- Verify data
SELECT 'Users created:' AS info, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Rooms created:' AS info, COUNT(*) AS count FROM rooms;

