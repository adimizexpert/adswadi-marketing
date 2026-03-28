/**
 * Run the following SQL once in Supabase SQL Editor (Dashboard → SQL → New query).
 *
 * ---------------------------------------------------------------------------
 * -- Table 1: plans (pricing)
 * CREATE TABLE plans (
 *   id SERIAL PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   label TEXT NOT NULL,
 *   price INTEGER NOT NULL,
 *   badge TEXT,
 *   features JSONB NOT NULL,
 *   cta_text TEXT NOT NULL,
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- Table 2: site_content (hero, taglines, CTA text, WhatsApp number)
 * CREATE TABLE site_content (
 *   key TEXT PRIMARY KEY,
 *   value TEXT NOT NULL,
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- Table 3: services
 * CREATE TABLE services (
 *   id SERIAL PRIMARY KEY,
 *   icon TEXT,
 *   title TEXT NOT NULL,
 *   description TEXT NOT NULL,
 *   sort_order INTEGER DEFAULT 0,
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- Table 4: admin_users
 * CREATE TABLE admin_users (
 *   id SERIAL PRIMARY KEY,
 *   username TEXT UNIQUE NOT NULL,
 *   password_hash TEXT NOT NULL
 * );
 *
 * -- Seed default admin (password: adswadi2025 — user must change this)
 * INSERT INTO admin_users (username, password_hash)
 * VALUES ('admin', '$2b$10$xaPVFDblFfz6eTYSZhFw3eanFEMBPoQPWZ0Zi5C7L5u4X4p7oM6kS');
 *
 * -- Seed default plans
 * INSERT INTO plans (name, label, price, badge, features, cta_text) VALUES
 * ('silver', 'Starter Pack', 9999, NULL,
 *   '["4 Long Videos / Month","Basic Research & Scripting","Standard Cuts & Subtitles","4 Thumbnail Designs","Email Support"]',
 *   'Silver Se Shuru Karein'),
 * ('gold', 'Growth Pack', 18999, 'Most Popular',
 *   '["8 Long Videos / Month","Deep Storytelling Scripts","Premium Motion Graphics","8 Thumbnails + A/B Testing","Priority WhatsApp Support"]',
 *   'Gold Choose Karein'),
 * ('diamond', 'Diamond Pack', 29999, NULL,
 *   '["12 Long + 10 Shorts / Month","Viral Hooks + Growth Strategy","Netflix-Style Documentary Editing","Unlimited Thumbnail Revisions","Personal Brand Consultant"]',
 *   'Diamond Le Lo');
 *
 * -- Seed default site_content
 * INSERT INTO site_content (key, value) VALUES
 * ('hero_headline_line1', 'Hum Aapke YouTube Channel Ko'),
 * ('hero_headline_line2', 'Ek Brand Mein Badalte Hain.'),
 * ('hero_subheadline', 'Scripting, Editing aur Thumbnails — sab kuch ek hi jagah.'),
 * ('hero_subtext_line2', 'Aap sirf content par focus karo, baaki sab humara kaam.'),
 * ('whatsapp_number', '91XXXXXXXXXX'),
 * ('cta_section_headline', 'Ready Ho Aapka Channel Grow Karne Ke Liye?'),
 * ('cta_section_subtext', 'Aaj hi free consultation book karo. Zero commitment, 100% value.'),
 * ('footer_tagline', 'YouTube Growth Ka Adda.');
 *
 * -- Seed default services
 * INSERT INTO services (icon, title, description, sort_order) VALUES
 * ('📝', 'High-Retention Scripting', 'Psychology-based storytelling jo audience ko screen se chhodne na de. Deep research + viral hooks + emotional arc — sab included.', 0),
 * ('🎬', 'Premium Video Editing', 'Netflix-style documentary cuts se lekar viral Shorts tak. Motion graphics, color grading, captions — sab premium.', 1),
 * ('🖼️', 'High-CTR Thumbnails', 'Aise designs jo scroll ruk ke click karne par majboor karein. A/B tested, data-backed, brand-consistent.', 2);
 * ---------------------------------------------------------------------------
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "[db] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment."
  );
}

const supabase = createClient(supabaseUrl || "", supabaseKey || "", {
  auth: { persistSession: false, autoRefreshToken: false },
});

module.exports = { supabase };
