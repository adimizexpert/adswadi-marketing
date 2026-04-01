-- SQLite schema (single file DB — no external Postgres). Applied automatically on API startup.

CREATE TABLE IF NOT EXISTS plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  price INTEGER NOT NULL,
  badge TEXT,
  features TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'youtube',
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

INSERT OR IGNORE INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$10$xaPVFDblFfz6eTYSZhFw3eanFEMBPoQPWZ0Zi5C7L5u4X4p7oM6kS');

INSERT INTO plans (name, label, price, badge, features, cta_text)
SELECT 'silver', 'Starter Pack', 9999, NULL,
  '["4 Long Videos / Month","Basic Research & Scripting","Standard Cuts & Subtitles","4 Thumbnail Designs","Email Support"]',
  'Start with Silver'
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'silver');

INSERT INTO plans (name, label, price, badge, features, cta_text)
SELECT 'gold', 'Growth Pack', 18999, 'Most Popular',
  '["8 Long Videos / Month","Deep Storytelling Scripts","Premium Motion Graphics","8 Thumbnails + A/B Testing","Priority WhatsApp Support"]',
  'Choose Gold'
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'gold');

INSERT INTO plans (name, label, price, badge, features, cta_text)
SELECT 'diamond', 'Diamond Pack', 29999, NULL,
  '["12 Long + 10 Shorts / Month","Viral Hooks + Growth Strategy","Netflix-Style Documentary Editing","Unlimited Thumbnail Revisions","Personal Brand Consultant"]',
  'Get Diamond'
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'diamond');

INSERT INTO site_content (key, value) VALUES
('hero_headline_line1', 'Adswadi SMM'),
('hero_headline_line2', 'Social media management — YouTube first. Instagram and UGC.'),
('hero_subheadline', 'Scripts, CTR thumbnails, editing, and AI-assisted workflows tuned for trending growth. Pricing appears at the end of each platform section.'),
('hero_subtext_line2', ''),
('whatsapp_number', '91XXXXXXXXXX'),
('cta_section_headline', 'Ready to talk through your stack?'),
('cta_section_subtext', 'Book a free consultation on WhatsApp. We align scope and pricing on a short call.'),
('footer_tagline', 'YouTube, Instagram, and UGC under one roof.'),
('media_youtube_showcase', '[]'),
('media_portfolio_youtube', '[]'),
('media_portfolio_instagram', '[]'),
('media_portfolio_ugc', '[]'),
('payment_config', '{"upiId":"","upiName":"Adswadi","whatsappNumber":"91XXXXXXXXXX","qrImageUrl":""}')
ON CONFLICT (key) DO NOTHING;

INSERT INTO services (icon, title, description, sort_order)
SELECT 'filetext', 'High-Retention Scripting', 'Psychology-based storytelling that keeps viewers watching. Deep research, viral hooks, and a full emotional arc included.', 0
WHERE NOT EXISTS (SELECT 1 FROM services WHERE sort_order = 0);

INSERT INTO services (icon, title, description, sort_order)
SELECT 'clapperboard', 'Premium Video Editing', 'From documentary-style long edits to viral Shorts. Motion graphics, color grading, and captions at a premium level.', 1
WHERE NOT EXISTS (SELECT 1 FROM services WHERE sort_order = 1);

INSERT INTO services (icon, title, description, sort_order)
SELECT 'image', 'High-CTR Thumbnails', 'Designs built to stop the scroll and earn clicks. A/B tested, data-backed, and on-brand.', 2
WHERE NOT EXISTS (SELECT 1 FROM services WHERE sort_order = 2);
