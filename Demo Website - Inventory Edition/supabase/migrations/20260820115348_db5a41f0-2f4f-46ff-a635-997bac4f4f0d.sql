DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE existing int;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT count(*) INTO existing FROM public.user_roles WHERE role = 'admin';
  IF existing > 0 THEN RETURN public.has_role(auth.uid(), 'admin'); END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END; $$;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  blurb text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.machines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  caption text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  available boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  primary_image text NOT NULL DEFAULT '',
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.machines TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.machines TO authenticated;
GRANT ALL ON public.machines TO service_role;
ALTER TABLE public.machines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "machines public read" ON public.machines FOR SELECT USING (true);
CREATE POLICY "machines admin write" ON public.machines FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER machines_updated_at BEFORE UPDATE ON public.machines
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.machine_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id uuid NOT NULL REFERENCES public.machines(id) ON DELETE CASCADE,
  url text NOT NULL,
  storage_path text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.machine_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.machine_images TO authenticated;
GRANT ALL ON public.machine_images TO service_role;
ALTER TABLE public.machine_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "machine images public read" ON public.machine_images FOR SELECT USING (true);
CREATE POLICY "machine images admin write" ON public.machine_images FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL,
  machine_id uuid REFERENCES public.machines(id) ON DELETE SET NULL,
  machine_name text NOT NULL DEFAULT 'General enquiry',
  requirement text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  is_resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit an enquiry" ON public.enquiries FOR INSERT
  WITH CHECK (
    length(trim(name)) BETWEEN 1 AND 120
    AND length(trim(email)) BETWEEN 3 AND 255
    AND length(trim(requirement)) BETWEEN 1 AND 2000
    AND is_read = false AND is_resolved = false
  );
CREATE POLICY "admins read enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins update enquiries" ON public.enquiries FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete enquiries" ON public.enquiries FOR DELETE TO authenticated USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.site_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  marquee_enabled boolean NOT NULL DEFAULT true,
  marquee_speed text NOT NULL DEFAULT 'normal' CHECK (marquee_speed IN ('slow','normal','fast')),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site settings public read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site settings admin write" ON public.site_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.company_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  business_name text NOT NULL DEFAULT 'Ironclad Machinery Co.',
  address text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  gst text NOT NULL DEFAULT '',
  details_are_placeholder boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.company_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.company_settings TO authenticated;
GRANT ALL ON public.company_settings TO service_role;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "company settings public read" ON public.company_settings FOR SELECT USING (true);
CREATE POLICY "company settings admin write" ON public.company_settings FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.proof_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value text NOT NULL,
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.proof_points TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proof_points TO authenticated;
GRANT ALL ON public.proof_points TO service_role;
ALTER TABLE public.proof_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proof points public read" ON public.proof_points FOR SELECT USING (true);
CREATE POLICY "proof points admin write" ON public.proof_points FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "machine photos read" ON storage.objects FOR SELECT
  USING (bucket_id = 'machine-photos');
CREATE POLICY "machine photos admin insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'machine-photos' AND public.is_admin());
CREATE POLICY "machine photos admin update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'machine-photos' AND public.is_admin());
CREATE POLICY "machine photos admin delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'machine-photos' AND public.is_admin());

INSERT INTO public.site_settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.company_settings (id, address, phone, email, whatsapp, gst)
VALUES (true,
  'Placeholder — Unit 14, Industrial Estate, Ahmedabad, Gujarat, India',
  '+00 00000 00000 (placeholder)',
  'sales@example.com (placeholder)',
  '0000000000',
  'GSTIN placeholder')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.proof_points (value, label, sort_order)
SELECT * FROM (VALUES
  ('180+', 'Machines handled', 0),
  ('14', 'Countries shipped to', 1),
  ('48 hrs', 'Typical quote turnaround', 2),
  ('100%', 'Inspection reports shared', 3)
) AS v(value, label, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.proof_points);

INSERT INTO public.categories (slug, name, blurb, sort_order)
SELECT * FROM (VALUES
  ('steam-boilers', 'Steam Boilers', 'IBR and non-IBR packaged, water-tube and smoke-tube units.', 0),
  ('steam-turbines', 'Steam Turbines', 'Back-pressure, extraction and condensing sets with gearboxes.', 1),
  ('power-plants', 'Power Plants', 'Complete captive islands and containerised generation modules.', 2),
  ('diesel-generators', 'Diesel Generators', 'Standby and prime-rated sets from 250 kVA upward.', 3),
  ('ancillary-equipment', 'Ancillary Equipment', 'Feed pumps, deaerators, heat exchangers and switchgear.', 4)
) AS v(slug, name, blurb, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.categories);

INSERT INTO public.machines (slug, name, caption, description, category_id, available, featured, sort_order, primary_image, specs)
SELECT v.slug, v.name, v.caption, v.description, c.id, v.available, v.featured, v.sort_order, v.primary_image, v.specs::jsonb
FROM (VALUES
  ('ibr-water-tube-boiler-12-tph','IBR Water-Tube Boiler — 12 TPH','Refurbished bi-drum boiler, 12 TPH at 45 kg/cm²',
   'Bi-drum water-tube steam boiler rated 12 TPH at 45 kg/cm² working pressure, previously operated on bagasse and coal firing. Pressure parts inspected, headers hydro-tested and refractory relined. Supplied with combustion air fans, feed pumps and instrumentation. Documentation set available for statutory review; IBR revalidation to be completed by the buyer''s authorised inspector.',
   'steam-boilers', true, true, 0,
   'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=80',
   '[{"label":"Capacity","value":"12 TPH"},{"label":"Design pressure","value":"45 kg/cm²"},{"label":"Steam temperature","value":"400 °C"},{"label":"Fuel","value":"Bagasse / coal, travelling grate"},{"label":"Condition","value":"Refurbished, pressure parts tested"}]'),
  ('back-pressure-steam-turbine-3-mw','Back-Pressure Steam Turbine — 3 MW','Multi-stage back-pressure set with reduction gearbox',
   'Multi-stage back-pressure steam turbine generating set rated 3 MW, inlet 42 kg/cm² / 395 °C with 3.5 kg/cm² exhaust for process steam. Rotor balanced, blades inspected and bearings replaced. Package includes reduction gearbox, lube oil console, governing system and brushless alternator. Suited to sugar, paper and chemical cogeneration duty.',
   'steam-turbines', true, true, 1,
   'https://www.ogk2.ru/upload/resize_cache/iblock/55a/hlrfv9z1tikkr5hsuccfncb2k99htisw/612_458_1/DSC_9263.jpg',
   '[{"label":"Output","value":"3 MW"},{"label":"Inlet steam","value":"42 kg/cm² / 395 °C"},{"label":"Exhaust","value":"3.5 kg/cm² (back pressure)"},{"label":"Speed","value":"8,150 rpm via gearbox to 1,500 rpm"},{"label":"Alternator","value":"Brushless, 11 kV"}]'),
  ('condensing-steam-turbine-8-mw','Condensing Steam Turbine — 8 MW','Full condensing set with surface condenser package',
   'Eight megawatt full condensing steam turbine with surface condenser, ejector system and cooling water pumps. Removed from a captive cogeneration plant during a capacity upgrade. Complete mechanical inspection report available; rotor and diaphragms in serviceable condition. Erection and commissioning support can be arranged through our field service partners.',
   'steam-turbines', false, false, 2,
   'https://www.svetenergie.cz/ver/21725003419000/api/stages/files?file=%2Fse%2Fmedia%2Fjaderna-energie%2Ffoto_86_strojovna.jpg&variant=next-fe&width=3840',
   '[{"label":"Output","value":"8 MW"},{"label":"Inlet steam","value":"64 kg/cm² / 480 °C"},{"label":"Condenser","value":"Surface type, twin-pass"},{"label":"Speed","value":"6,800 rpm"},{"label":"Condition","value":"Dismantled, stored under cover"}]'),
  ('captive-cogeneration-plant-15-mw','Captive Cogeneration Plant — 15 MW','Complete boiler, turbine and balance-of-plant package',
   'Complete 15 MW captive cogeneration island comprising a 70 TPH boiler, condensing-cum-extraction turbine, switchyard equipment, water treatment plant and control room. Offered as a single lot with drawings and equipment schedules. Dismantling and load-out can be coordinated on a supervised basis at the seller''s site.',
   'power-plants', true, true, 3,
   'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
   '[{"label":"Plant output","value":"15 MW"},{"label":"Boiler","value":"70 TPH, 87 kg/cm²"},{"label":"Turbine","value":"Extraction-cum-condensing"},{"label":"Scope","value":"Boiler, TG set, BOP, switchyard"},{"label":"Availability","value":"Lot sale, supervised dismantling"}]'),
  ('hfo-power-module-6-mw','HFO Power Module — 6 MW','Containerised heavy fuel oil generating module',
   'Containerised heavy fuel oil power module rated 6 MW, configured for grid-parallel or island operation. Includes fuel treatment skid, radiators, exhaust silencer and synchronising panel. Running hours and maintenance history documented. Suitable for mining, textile and process plants requiring firm captive capacity.',
   'power-plants', false, false, 4,
   'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1600&q=80',
   '[{"label":"Output","value":"6 MW"},{"label":"Fuel","value":"Heavy fuel oil / furnace oil"},{"label":"Configuration","value":"Containerised, 3 × 2 MW sets"},{"label":"Voltage","value":"11 kV, 50 Hz"},{"label":"Condition","value":"Operational, service records available"}]'),
  ('diesel-generating-set-1500-kva','Diesel Generating Set — 1500 kVA','Low running hours, AMF panel and acoustic enclosure',
   '1500 kVA prime-rated diesel generating set with acoustic enclosure, AMF panel and 990-litre base fuel tank. Recorded running hours under 4,000. Engine compression tested, alternator insulation resistance verified and load bank tested before despatch. Ideal standby capacity for hospitals, data facilities and manufacturing lines.',
   'diesel-generators', true, true, 5,
   'https://inrorwxhjqnrjj5q-static.micyjz.com/cloud/lnBpoKqijkSRlkqjonrpjq/tu.png',
   '[{"label":"Rating","value":"1500 kVA prime"},{"label":"Voltage","value":"415 V, 50 Hz"},{"label":"Running hours","value":"Under 4,000 (logged)"},{"label":"Enclosure","value":"Acoustic, 75 dB(A) at 1 m"},{"label":"Testing","value":"Load bank tested at 100%"}]'),
  ('diesel-generating-set-500-kva','Diesel Generating Set — 500 kVA','Skid-mounted standby set with digital controller',
   '500 kVA skid-mounted standby diesel generating set with digital genset controller, battery charger and radiator cooling. Overhauled fuel injection system and new filtration. Compact footprint for plant rooms with limited access. Delivered with test certificate and operating manuals.',
   'diesel-generators', true, false, 6,
   'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1600&q=80',
   '[{"label":"Rating","value":"500 kVA standby"},{"label":"Voltage","value":"415 V, 50 Hz"},{"label":"Controller","value":"Digital, auto-start capable"},{"label":"Cooling","value":"Radiator, ambient 50 °C"},{"label":"Condition","value":"Overhauled fuel system"}]'),
  ('boiler-feed-pump-deaerator-package','Boiler Feed Pump & Deaerator Package','Ancillary set: feed pumps, deaerator and feed water tank',
   'Ancillary package comprising two multistage boiler feed pumps with motors, a spray-tray deaerator and a 25 m³ feed water storage tank. Suited to boilers up to 30 TPH. Pumps stripped, inspected and reassembled with new mechanical seals. Sold as a package or as individual items on request.',
   'ancillary-equipment', false, false, 7,
   'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1600&q=80',
   '[{"label":"Pumps","value":"2 × multistage, 30 m³/h at 55 bar"},{"label":"Deaerator","value":"Spray-tray, 30 TPH"},{"label":"Storage tank","value":"25 m³ horizontal"},{"label":"Motors","value":"75 kW, 415 V"},{"label":"Condition","value":"Overhauled, new seals"}]')
) AS v(slug, name, caption, description, cat_slug, available, featured, sort_order, primary_image, specs)
JOIN public.categories c ON c.slug = v.cat_slug
WHERE NOT EXISTS (SELECT 1 FROM public.machines);

INSERT INTO public.machine_images (machine_id, url, sort_order)
SELECT m.id, v.url, v.sort_order
FROM (VALUES
  ('ibr-water-tube-boiler-12-tph','https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1600&q=80',0),
  ('ibr-water-tube-boiler-12-tph','https://www.svetenergie.cz/ver/21725003419000/api/stages/files?file=%2Fse%2Fmedia%2Fjaderna-energie%2Ffoto_86_strojovna.jpg&variant=next-fe&width=3840',1),
  ('back-pressure-steam-turbine-3-mw','https://www.svetenergie.cz/ver/21725003419000/api/stages/files?file=%2Fse%2Fmedia%2Fjaderna-energie%2Ffoto_86_strojovna.jpg&variant=next-fe&width=3840',0),
  ('back-pressure-steam-turbine-3-mw','https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1600&q=80',1),
  ('condensing-steam-turbine-8-mw','https://www.ogk2.ru/upload/resize_cache/iblock/55a/hlrfv9z1tikkr5hsuccfncb2k99htisw/612_458_1/DSC_9263.jpg',0),
  ('condensing-steam-turbine-8-mw','https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1600&q=80',1),
  ('captive-cogeneration-plant-15-mw','https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1600&q=80',0),
  ('captive-cogeneration-plant-15-mw','https://www.svetenergie.cz/ver/21725003419000/api/stages/files?file=%2Fse%2Fmedia%2Fjaderna-energie%2Ffoto_86_strojovna.jpg&variant=next-fe&width=3840',1),
  ('hfo-power-module-6-mw','https://inrorwxhjqnrjj5q-static.micyjz.com/cloud/lnBpoKqijkSRlkqjonrpjq/tu.png',0),
  ('diesel-generating-set-1500-kva','https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1600&q=80',0),
  ('diesel-generating-set-1500-kva','https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1600&q=80',1),
  ('diesel-generating-set-500-kva','https://inrorwxhjqnrjj5q-static.micyjz.com/cloud/lnBpoKqijkSRlkqjonrpjq/tu.png',0),
  ('boiler-feed-pump-deaerator-package','https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1600&q=80',0)
) AS v(slug, url, sort_order)
JOIN public.machines m ON m.slug = v.slug
WHERE NOT EXISTS (SELECT 1 FROM public.machine_images);
