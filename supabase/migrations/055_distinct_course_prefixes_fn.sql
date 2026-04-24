-- Returns distinct course code prefixes (the part before the first space) for a given institution.
create or replace function distinct_course_prefixes(p_institution_id uuid)
returns table(prefix text)
language sql stable
as $$
  select distinct split_part(code, ' ', 1) as prefix
  from courses
  where institution_id = p_institution_id
  order by prefix;
$$;
