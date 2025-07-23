-- Enable RLS INSERT policy for events table to allow edge functions to insert scraped activities
CREATE POLICY "Enable service role to insert events" ON public.events
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Also allow authenticated users to insert events (for user-generated content)
CREATE POLICY "Enable authenticated users to insert events" ON public.events
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);