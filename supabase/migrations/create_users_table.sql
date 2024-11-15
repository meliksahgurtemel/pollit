create table public.users (
  id uuid default uuid_generate_v4() primary key,
  nullifier_hash text unique not null,
  verification_level text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone
);