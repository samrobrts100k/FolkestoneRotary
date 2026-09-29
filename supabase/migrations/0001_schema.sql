-- Folkestone Rotary – core schema, RLS and storage. Run in the Supabase SQL editor or via `supabase db push`.
create extension if not exists "pgcrypto";

create type content_status as enum ('draft', 'published', 'scheduled', 'archived');
create type app_role as enum ('admin', 'editor', 'events_manager', 'news_editor', 'funding_reviewer', 'member');
create type funding_status as enum ('received', 'under_review', 'approved', 'declined', 'more_info_required');

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ===== Users & profiles (auth.users is the "users" table, managed by Supabase Auth) =====
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role app_role not null default 'member',
  is_active boolean not null default false,           -- admins approve new sign-ups
  show_in_directory boolean not null default true,
  club_role text,                                     -- e.g. President
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated before update on profiles for each row execute function set_updated_at();

create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, full_name) values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- Role helpers (security definer avoids RLS recursion on profiles)
create or replace function current_role_name() returns text language sql stable security definer set search_path = public as $$
  select role::text from profiles where id = auth.uid() and is_active
$$;
create or replace function has_role(roles text[]) returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(current_role_name() = any(roles), false)
$$;

-- ===== Categories =====
create table event_categories (slug text primary key, name text not null, sort_order int default 0);
create table news_categories  (slug text primary key, name text not null, sort_order int default 0);

-- ===== CMS content =====
create table events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null default '',
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue_name text not null default '',
  address text, postcode text, lat double precision, lng double precision,
  category text references event_categories(slug),
  image_url text, image_alt text default '',
  book_url text, enter_url text, ticket_info text,
  programme jsonb default '[]', sponsors text[] default '{}', gallery jsonb default '[]', downloads jsonb default '[]', faq jsonb default '[]',
  show_countdown boolean default false,
  status content_status not null default 'draft', publish_at timestamptz,
  is_sample boolean default false,
  created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger events_updated before update on events for each row execute function set_updated_at();

create table news (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, summary text not null default '', body text not null default '',
  author text default 'Folkestone Rotary', category text references news_categories(slug), tags text[] default '{}',
  image_url text, image_alt text default '', published_at timestamptz not null default now(), featured boolean default false,
  status content_status not null default 'draft', publish_at timestamptz, is_sample boolean default false,
  created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger news_updated before update on news for each row execute function set_updated_at();

create table impact_stories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, organisation text not null default '', summary text not null default '',
  outcome text not null default '', body text, amount_awarded numeric(12,2), image_url text, image_alt text default '',
  status content_status not null default 'draft', publish_at timestamptz, is_sample boolean default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger stories_updated before update on impact_stories for each row execute function set_updated_at();

create table stats (
  id uuid primary key default gen_random_uuid(),
  label text not null, value numeric not null, prefix text default '', suffix text default '', sort_order int default 0,
  is_sample boolean default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger stats_updated before update on stats for each row execute function set_updated_at();

create table sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null, logo_url text, website text, email text, phone text, description text,
  level text not null default 'community' check (level in ('gold','silver','bronze','community')),
  event_id uuid references events(id) on delete set null, starts_on date, ends_on date,
  status content_status not null default 'draft', publish_at timestamptz, is_sample boolean default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger sponsors_updated before update on sponsors for each row execute function set_updated_at();

-- Editable page text + small repeatable items (FAQs, testimonials, annual reports, timeline, leaders)
create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, meta_description text, body text,
  status content_status not null default 'draft', publish_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger pages_updated before update on pages for each row execute function set_updated_at();

create table content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('faq','testimonial','annual_report','timeline','leader')),
  title text not null, body text, url text, page text, sort_order int default 0,
  status content_status not null default 'draft', publish_at timestamptz, is_sample boolean default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger content_items_updated before update on content_items for each row execute function set_updated_at();

-- ===== Media & galleries =====
create table media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null, url text not null, alt text not null default '', caption text, mime_type text, size_bytes bigint,
  uploaded_by uuid references auth.users(id), created_at timestamptz not null default now()
);
create table galleries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, description text,
  status content_status not null default 'draft', publish_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger galleries_updated before update on galleries for each row execute function set_updated_at();
create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references galleries(id) on delete cascade,
  media_id uuid references media(id) on delete set null,
  url text not null, alt text not null default '', caption text, sort_order int default 0, created_at timestamptz not null default now()
);

-- ===== Public submissions (inserted by server actions with the service role) =====
create table contact_enquiries (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text, subject text not null, message text not null,
  status text not null default 'new', consent_given_at timestamptz not null, created_at timestamptz not null default now()
);
create table membership_enquiries (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text, age_range text, occupation text,
  why_interested text not null, preferred_contact text, status text not null default 'new', consent_given_at timestamptz not null, created_at timestamptz not null default now()
);
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(), first_name text not null, last_name text not null, email text not null unique,
  is_subscribed boolean not null default true, consent_given_at timestamptz not null, created_at timestamptz not null default now()
);
create table funding_applications (
  id uuid primary key default gen_random_uuid(),
  organisation_name text not null, charity_number text, contact_name text not null, email text not null, phone text, website text,
  project_name text not null, project_description text not null, amount_requested numeric(12,2) not null, total_project_cost numeric(12,2) not null,
  who_benefits text, beneficiary_count int, expected_outcomes text, other_funding text, start_date date, end_date date, additional_info text,
  status funding_status not null default 'received', reviewer_notes text, reviewed_by uuid references auth.users(id),
  consent_given_at timestamptz not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger funding_updated before update on funding_applications for each row execute function set_updated_at();
create table funding_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references funding_applications(id) on delete cascade,
  doc_type text not null check (doc_type in ('quote','supporting','budget','image')),
  file_name text not null, storage_path text not null, size_bytes bigint, created_at timestamptz not null default now()
);
-- Optional record-keeping: donations are taken on an external donation site, so rows are added manually or via import.
create table donations (
  id uuid primary key default gen_random_uuid(), donor_name text, donor_email text, amount numeric(12,2), currency text default 'GBP',
  frequency text default 'one_off', gift_aid boolean default false, source text default 'external', external_reference text, created_at timestamptz not null default now()
);

-- ===== Members area =====
create table meetings (
  id uuid primary key default gen_random_uuid(), title text not null, starts_at timestamptz not null, venue text, notes text, created_at timestamptz not null default now()
);
create table member_documents (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('minutes','policy','document','committee','download')),
  title text not null, url text not null, meeting_date date, created_at timestamptz not null default now()
);

-- ===== Row level security =====
do $$ declare t text; begin
  foreach t in array array['profiles','event_categories','news_categories','events','news','impact_stories','stats','sponsors','pages','content_items','media','galleries','gallery_images',
    'contact_enquiries','membership_enquiries','newsletter_subscribers','funding_applications','funding_documents','donations','meetings','member_documents'] loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- Public read of published content
create policy "public read categories" on event_categories for select using (true);
create policy "public read news categories" on news_categories for select using (true);
create policy "public read events" on events for select using (status = 'published' or (status = 'scheduled' and publish_at <= now()) or has_role(array['admin','editor','events_manager']));
create policy "public read news" on news for select using (status = 'published' or (status = 'scheduled' and publish_at <= now()) or has_role(array['admin','editor','news_editor']));
create policy "public read stories" on impact_stories for select using (status = 'published' or (status = 'scheduled' and publish_at <= now()) or has_role(array['admin','editor']));
create policy "public read stats" on stats for select using (true);
create policy "public read sponsors" on sponsors for select using (status = 'published' or (status = 'scheduled' and publish_at <= now()) or has_role(array['admin','editor']));
create policy "public read pages" on pages for select using (status = 'published' or has_role(array['admin','editor']));
create policy "public read content items" on content_items for select using (status = 'published' or (status = 'scheduled' and publish_at <= now()) or has_role(array['admin','editor']));
create policy "public read galleries" on galleries for select using (status = 'published' or has_role(array['admin','editor']));
create policy "public read gallery images" on gallery_images for select using (true);
create policy "public read media" on media for select using (true);

-- Staff write access by role
create policy "staff write events" on events for all using (has_role(array['admin','editor','events_manager'])) with check (has_role(array['admin','editor','events_manager']));
create policy "staff write event cats" on event_categories for all using (has_role(array['admin','editor'])) with check (has_role(array['admin','editor']));
create policy "staff write news" on news for all using (has_role(array['admin','editor','news_editor'])) with check (has_role(array['admin','editor','news_editor']));
create policy "staff write news cats" on news_categories for all using (has_role(array['admin','editor','news_editor'])) with check (has_role(array['admin','editor','news_editor']));
do $$ declare t text; begin
  foreach t in array array['impact_stories','stats','sponsors','pages','content_items','media','galleries','gallery_images'] loop
    execute format('create policy "staff write %1$s" on %1$I for all using (has_role(array[''admin'',''editor''])) with check (has_role(array[''admin'',''editor'']))', t);
  end loop;
end $$;

-- Submissions: no public access (server uses the service role). Staff read/manage.
create policy "staff manage contact" on contact_enquiries for all using (has_role(array['admin','editor'])) with check (has_role(array['admin','editor']));
create policy "staff manage membership" on membership_enquiries for all using (has_role(array['admin','editor'])) with check (has_role(array['admin','editor']));
create policy "staff manage newsletter" on newsletter_subscribers for all using (has_role(array['admin','editor'])) with check (has_role(array['admin','editor']));
create policy "reviewers manage funding" on funding_applications for all using (has_role(array['admin','funding_reviewer'])) with check (has_role(array['admin','funding_reviewer']));
create policy "reviewers manage funding docs" on funding_documents for all using (has_role(array['admin','funding_reviewer'])) with check (has_role(array['admin','funding_reviewer']));
create policy "admin manage donations" on donations for all using (has_role(array['admin'])) with check (has_role(array['admin']));

-- Profiles: users read their own row; active members read the directory; admins manage everyone
create policy "read own profile" on profiles for select using (id = auth.uid());
create policy "members read directory" on profiles for select using (is_active and show_in_directory and current_role_name() is not null);
create policy "admin manage profiles" on profiles for all using (has_role(array['admin'])) with check (has_role(array['admin']));
create policy "update own basic profile" on profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()) and is_active);

-- Members area: any active member
create policy "members read meetings" on meetings for select using (current_role_name() is not null);
create policy "members read documents" on member_documents for select using (current_role_name() is not null and (kind <> 'committee' or has_role(array['admin','editor'])));
create policy "staff manage meetings" on meetings for all using (has_role(array['admin','editor'])) with check (has_role(array['admin','editor']));
create policy "staff manage documents" on member_documents for all using (has_role(array['admin','editor'])) with check (has_role(array['admin','editor']));

-- ===== Storage =====
insert into storage.buckets (id, name, public) values ('media', 'media', true), ('documents', 'documents', true), ('funding-documents', 'funding-documents', false)
  on conflict (id) do nothing;
create policy "public read media files" on storage.objects for select using (bucket_id in ('media', 'documents'));
create policy "staff upload media" on storage.objects for insert with check (bucket_id in ('media', 'documents') and has_role(array['admin','editor','events_manager','news_editor']));
create policy "staff delete media" on storage.objects for delete using (bucket_id in ('media', 'documents') and has_role(array['admin','editor']));
create policy "reviewers read funding files" on storage.objects for select using (bucket_id = 'funding-documents' and has_role(array['admin','funding_reviewer']));
