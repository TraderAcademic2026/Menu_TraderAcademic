CREATE TABLE IF NOT EXISTS public.app_config (
  id bigint PRIMARY KEY DEFAULT 1,
  name text,
  description text,
  profile_image text,
  cover_image text,
  hours text
);

CREATE TABLE IF NOT EXISTS public.links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  url text NOT NULL,
  icon text,
  color text,
  sort_order int4 DEFAULT 0
);

INSERT INTO public.app_config (id, name, description, hours)
VALUES (1, 'Menu Trader', 'Links Oficiais', 'Disponível 24h')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.links (title, subtitle, url, icon, color, sort_order)
VALUES ('WhatsApp', 'Fale conosco', 'https://wa.me/5500000000000', 'MessageCircle', 'bg-green-600', 1)
ON CONFLICT DO NOTHING;
