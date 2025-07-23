-- Clean up activities with incorrect Leeds coordinates that should be in other cities
DELETE FROM events 
WHERE latitude = 53.8008 
AND longitude = -1.5491 
AND (
  lower(location) LIKE '%lisbon%' 
  OR lower(location) LIKE '%portugal%'
  OR lower(title) LIKE '%lisbon%'
  OR organizer = 'scraped'
);