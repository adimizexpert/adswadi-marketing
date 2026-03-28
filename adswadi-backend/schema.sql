-- Run once against your PostgreSQL database (Render Postgres → Shell, or psql).
-- Safe to re-run: seeds use WHERE NOT EXISTS / ON CONFLICT where applicable.

CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  price INTEGER NOT NULL,
  badge TEXT,
  features JSONB NOT NULL,
  cta_text TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  icon TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$10$xaPVFDblFfz6eTYSZhFw3eanFEMBPoQPWZ0Zi5C7L5u4X4p7oM6kS')
ON CONFLICT (username) DO NOTHING;

INSERT INTO plans (name, label, price, badge, features, cta_text)
SELECT 'silver', 'Starter Pack', 9999, NULL,
  '["4 Long Videos / Month","Basic Research & Scripting","Standard Cuts & Subtitles","4 Thumbnail Designs","Email Support"]'::jsonb,
  'Silver Se Shuru Karein'
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'silver');

INSERT INTO plans (name, label, price, badge, features, cta_text)
SELECT 'gold', 'Growth Pack', 18999, 'Most Popular',
  '["8 Long Videos / Month","Deep Storytelling Scripts","Premium Motion Graphics","8 Thumbnails + A/B Testing","Priority WhatsApp Support"]'::jsonb,
  'Gold Choose Karein'
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'gold');

INSERT INTO plans (name, label, price, badge, features, cta_text)
SELECT 'diamond', 'Diamond Pack', 29999, NULL,
  '["12 Long + 10 Shorts / Month","Viral Hooks + Growth Strategy","Netflix-Style Documentary Editing","Unlimited Thumbnail Revisions","Personal Brand Consultant"]'::jsonb,
  'Diamond Le Lo'
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'diamond');

INSERT INTO site_content (key, value) VALUES
('hero_headline_line1', 'Hum Aapke YouTube Channel Ko'),
('hero_headline_line2', 'Ek Brand Mein Badalte Hain.'),
('hero_subheadline', 'Scripting, Editing aur Thumbnails — sab kuch ek hi jagah.'),
('hero_subtext_line2', 'Aap sirf content par focus karo, baaki sab humara kaam.'),
('whatsapp_number', '91XXXXXXXXXX'),
('cta_section_headline', 'Ready Ho Aapka Channel Grow Karne Ke Liye?'),
('cta_section_subtext', 'Aaj hi free consultation book karo. Zero commitment, 100% value.'),
('footer_tagline', 'YouTube Growth Ka Adda.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO services (icon, title, description, sort_order)
SELECT 'filetext', 'High-Retention Scripting', 'Psychology-based storytelling jo audience ko screen se chhodne na de. Deep research + viral hooks + emotional arc — sab included.', 0
WHERE NOT EXISTS (SELECT 1 FROM services WHERE sort_order = 0);

INSERT INTO services (icon, title, description, sort_order)
SELECT 'clapperboard', 'Premium Video Editing', 'Netflix-style documentary cuts se lekar viral Shorts tak. Motion graphics, color grading, captions — sab premium.', 1
WHERE NOT EXISTS (SELECT 1 FROM services WHERE sort_order = 1);

INSERT INTO services (icon, title, description, sort_order)
SELECT 'image', 'High-CTR Thumbnails', 'Aise designs jo scroll ruk ke click karne par majboor karein. A/B tested, data-backed, brand-consistent.', 2
WHERE NOT EXISTS (SELECT 1 FROM services WHERE sort_order = 2);
