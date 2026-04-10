-- Migration 006: Fix profile auto-creation trigger on auth.users insert
-- This recreates the handle_new_user function and trigger to ensure
-- profiles are properly created when users sign up.

-- Drop existing trigger first to avoid conflicts
drop trigger if exists on_auth_user_created on auth.users;

-- Recreate function with improved error handling
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
exception
  when others then
    -- Log the error and return new to not block user creation
    raise warning 'handle_new_user trigger failed: %', sqlerrm;
    return new;
end;
$$;

-- Recreate the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
