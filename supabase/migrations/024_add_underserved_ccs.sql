-- Migration 024: Add community colleges from underserved/underrepresented regions
--
-- This migration adds support for the requested community_college type and
-- inserts 10 California community colleges across underserved regions.

alter table institutions
  add column if not exists short_name text,
  add column if not exists location text,
  add column if not exists description text;

alter table institutions
  drop constraint if exists institutions_type_check;

alter table institutions
  add constraint institutions_type_check
  check (type in ('cc', 'university', 'community_college')) on conflict do nothing;

insert into institutions (
  id,
  name,
  short_name,
  type,
  location,
  description,
  state,
  city,
  abbreviation
) values
  ('a0000000-0000-0000-0000-000000000008', 'Fresno City College', 'FCC', 'community_college', 'Fresno', 'Serves the Central Valley with a large rural and first-generation student population.', 'CA', 'Fresno', 'FCC'),
  ('a0000000-0000-0000-0000-000000000009', 'Bakersfield College', 'BC', 'community_college', 'Bakersfield', 'Supports an oil-country and diverse workforce across Kern County.', 'CA', 'Bakersfield', 'BC'),
  ('a0000000-0000-0000-0000-00000000000a', 'College of the Sequoias', 'COS', 'community_college', 'Visalia', 'Serves an agricultural region in the Central Valley.', 'CA', 'Visalia', 'COS'),
  ('a0000000-0000-0000-0000-00000000000b', 'Merced College', 'MC', 'community_college', 'Merced', 'Supports an underserved Central Valley community and Yosemite gateway region.', 'CA', 'Merced', 'MC'),
  ('a0000000-0000-0000-0000-00000000000c', 'Riverside City College', 'RCC', 'community_college', 'Riverside', 'Urban Inland Empire campus with strong transfer potential.', 'CA', 'Riverside', 'RCC'),
  ('a0000000-0000-0000-0000-00000000000d', 'San Bernardino Valley College', 'SBVC', 'community_college', 'San Bernardino', 'Serves a diverse Inland Empire community with broad access needs.', 'CA', 'San Bernardino', 'SBVC'),
  ('a0000000-0000-0000-0000-00000000000e', 'College of the Redwoods', 'CR', 'community_college', 'Eureka', 'Supports a rural North Coast region shaped by logging and tourism.', 'CA', 'Eureka', 'CR'),
  ('a0000000-0000-0000-0000-00000000000f', 'Mendocino College', 'MENDO', 'community_college', 'Ukiah', 'Serves a rural North Coast and wine-country access region.', 'CA', 'Ukiah', 'MENDO'),
  ('a0000000-0000-0000-0000-000000000010', 'Allan Hancock College', 'AHC', 'community_college', 'Santa Maria', 'Serves military families and agricultural communities on the Central Coast.', 'CA', 'Santa Maria', 'AHC'),
  ('a0000000-0000-0000-0000-000000000011', 'Cuesta College', 'CUESTA', 'community_college', 'San Luis Obispo', 'Serves a rural Central Coast region and acts as a Cal Poly feeder campus.', 'CA', 'San Luis Obispo', 'CUESTA')
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  type = excluded.type,
  location = excluded.location,
  description = excluded.description,
  state = excluded.state,
  city = excluded.city,
  abbreviation = excluded.abbreviation;
