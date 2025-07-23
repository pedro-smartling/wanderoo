-- Add unique constraint on external_url to support upsert operations
ALTER TABLE public.events 
ADD CONSTRAINT unique_external_url UNIQUE (external_url);