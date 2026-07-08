-- KTOS V1 MVP schema reference.
-- The runnable local implementation uses JSON storage first so the product loop
-- can be tested without database setup. These tables define the PostgreSQL
-- target shape for the same domain objects.

create table if not exists observation (
  id text primary key,
  teacher_id text not null,
  class_id text,
  input_type text not null,
  content text not null,
  created_at timestamptz not null
);

create table if not exists fact (
  id text primary key,
  teacher_id text not null,
  class_id text,
  student_id text,
  student_name text,
  event_type text not null,
  action text not null,
  description text not null,
  occurred_at timestamptz not null,
  recorded_at timestamptz not null,
  source jsonb not null,
  confidence numeric not null,
  confirm_status text not null,
  tags jsonb not null,
  created_by text not null,
  confirmed_at timestamptz,
  confirmed_by text,
  rejected_at timestamptz,
  rejected_by text,
  rejected_reason text
);

create table if not exists timeline_event (
  id text primary key,
  fact_id text not null references fact(id),
  teacher_id text not null,
  class_id text,
  occurred_at timestamptz not null,
  created_at timestamptz not null
);

create table if not exists report (
  id text primary key,
  teacher_id text not null,
  class_id text,
  report_date date not null,
  status text not null,
  source_fact_ids jsonb not null,
  content jsonb not null,
  created_at timestamptz not null,
  confirmed_at timestamptz,
  confirmed_by text
);
