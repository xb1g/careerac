-- Migration 023: Add major CSU campuses for transfer coverage
--
-- NOTE: institutions currently has no description column in schema,
-- so we add it here to support campus summaries.

alter table institutions
  add column if not exists description text;

insert into institutions (id, name, type, state, city, abbreviation, description) values
  ('b0000000-0000-0000-0000-000000000009', 'California State University, Northridge', 'university', 'CA', 'Northridge', 'CSUN', 'Large CSU campus serving the San Fernando Valley and a major transfer destination.'),
  ('b0000000-0000-0000-0000-00000000000a', 'California State University, Long Beach', 'university', 'CA', 'Long Beach', 'CSULB', 'Large, high-volume CSU campus in Southern California with strong transfer demand.'),
  ('b0000000-0000-0000-0000-00000000000b', 'San Diego State University', 'university', 'CA', 'San Diego', 'SDSU', 'Major public university in San Diego with broad transfer pathways.'),
  ('b0000000-0000-0000-0000-00000000000c', 'California State University, Fullerton', 'university', 'CA', 'Fullerton', 'CSUF', 'Popular CSU campus in Orange County with strong community college transfer coverage.'),
  ('b0000000-0000-0000-0000-00000000000d', 'California State University, Sacramento', 'university', 'CA', 'Sacramento', 'Sac State', 'Northern California CSU campus serving the Sacramento region and transfer students.')
on conflict (id) do update set
  name = excluded.name,
  type = excluded.type,
  state = excluded.state,
  city = excluded.city,
  abbreviation = excluded.abbreviation,
  description = excluded.description;
