create table public.users (
  id uuid default uuid_generate_v4() primary key,
  nullifier_hash text unique not null,
  verification_level text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login timestamp with time zone
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;

-- Create policies
create policy "Users can view their own data"
  on public.users
  for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users
  for update
  using (auth.uid() = id);