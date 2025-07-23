-- Add latitude and longitude columns to events table for map coordinates
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Add an index for location-based queries
CREATE INDEX IF NOT EXISTS idx_events_location ON public.events(latitude, longitude);