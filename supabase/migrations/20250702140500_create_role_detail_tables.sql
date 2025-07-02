-- Phase 1: Create New Tables and Compatibility Views

-- 1️⃣ Role-Specific Detail Tables
create table public.student_details (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  nis            text,                  -- National Student Number (optional)
  date_of_birth  date,
  gender         text check (gender in ('M','F')),
  boarding       boolean default false,
  created_at     timestamp with time zone default now(),
  updated_at     timestamp with time zone default now()
);

create table public.teacher_details (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  employee_id    text,
  hire_date      date,
  specialty      text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table public.parent_details (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  phone_number   text,
  address        text,
  occupation     text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create table public.management_details (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  position       text,
  hire_date      date,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- 2️⃣ Performance / Analytics Tables
create table public.student_performance (
  id              bigserial primary key,
  user_id         uuid references public.profiles(id) on delete cascade,
  period_start    date not null,
  period_end      date not null,
  academic_score  numeric,
  quran_score     numeric,
  attendance_pct  numeric,
  created_at      timestamptz default now()
);

create table public.teacher_performance (
  id                 bigserial primary key,
  user_id            uuid references public.profiles(id) on delete cascade,
  period_start       date not null,
  period_end         date not null,
  class_observation  numeric,
  punctuality_score  numeric,
  created_at         timestamptz default now()
);

comment on column public.student_details.nis is 'National Student Number (optional)'; 