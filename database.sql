-- Create an ENUM type for the permit status
CREATE TYPE permit_status AS ENUM ('safe', 'expiring', 'expired');

-- Create a public users table that links to Supabase's internal auth.users
CREATE TABLE public.users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR NOT NULL
);

-- Create the permit table
CREATE TABLE public.permits (
  permit_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
  powerplant VARCHAR,
  environmental_law VARCHAR,
  description VARCHAR,
  permit VARCHAR,
  unit_coverage VARCHAR,
  permit_number VARCHAR,
  date_issued DATE,
  expiry_date DATE,
  permit_status permit_status
);