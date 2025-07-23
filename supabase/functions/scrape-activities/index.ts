import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ScrapedActivity {
  title: string
  description: string
  location: string
  date_time: string
  price: number | null
  age_group: string
  category: string
  external_url: string
  organizer: string
  image_url?: string
  tags: string[]
  latitude?: number
  longitude?: number
}

// Common city coordinates as fallback
const CITY_COORDINATES: Record<string, { lat: number, lng: number }> = {
  'lisbon': { lat: 38.7223, lng: -9.1393 },
  'lisboa': { lat: 38.7223, lng: -9.1393 },
  'leeds': { lat: 53.8008, lng: -1.5491 },
  'london': { lat: 51.5074, lng: -0.1278 },
  'manchester': { lat: 53.4808, lng: -2.2426 },
  'birmingham': { lat: 52.4862, lng: -1.8904 },
  'glasgow': { lat: 55.8642, lng: -4.2518 },
  'edinburgh': { lat: 55.9533, lng: -3.1883 },
  'cardiff': { lat: 51.4816, lng: -3.1791 },
  'bristol': { lat: 51.4545, lng: -2.5879 },
  'liverpool': { lat: 53.4084, lng: -2.9916 },
  'newcastle': { lat: 54.9783, lng: -1.6178 },
  'york': { lat: 53.9600, lng: -1.0873 },
  'paris': { lat: 48.8566, lng: 2.3522 },
  'madrid': { lat: 40.4168, lng: -3.7038 },
  'barcelona': { lat: 41.3851, lng: 2.1734 },
  'rome': { lat: 41.9028, lng: 12.4964 },
  'milan': { lat: 45.4642, lng: 9.1900 },
  'berlin': { lat: 52.5200, lng: 13.4050 },
  'amsterdam': { lat: 52.3676, lng: 4.9041 },
  'brussels': { lat: 50.8503, lng: 4.3517 }
};

// Geocoding function with fallback to hardcoded coordinates
async function geocodeLocation(location: string): Promise<{ lat: number, lng: number } | null> {
  // First check if we have hardcoded coordinates for this city
  const cleanLocation = location.toLowerCase().trim();
  if (CITY_COORDINATES[cleanLocation]) {
    console.log(`Using hardcoded coordinates for ${location}:`, CITY_COORDINATES[cleanLocation]);
    return CITY_COORDINATES[cleanLocation];
  }
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'WanderoApp/1.0'
        }
      }
    );
    
    // Check if response is actually JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.log('Geocoding response is not JSON, trying fallback for:', location);
      // Try partial matches in our hardcoded list
      for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
        if (cleanLocation.includes(city) || city.includes(cleanLocation)) {
          console.log(`Found partial match ${city} for ${location}`);
          return coords;
        }
      }
      return null;
    }
    
    if (!response.ok) {
      console.log('Geocoding response not ok:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      console.log(`Successfully geocoded ${location}:`, result);
      return result;
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

async function scrapeEventbrite(location: string, category: string): Promise<ScrapedActivity[]> {
  const activities: ScrapedActivity[] = []
  
  try {
    // Search for kids activities on Eventbrite
    const searchUrl = `https://www.eventbrite.com/d/${encodeURIComponent(location)}/family--education--kids-activities/?page=1`
    console.log('Scraping Eventbrite URL:', searchUrl)
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      console.log('Eventbrite response not ok:', response.status)
      return activities
    }
    
    const html = await response.text()
    const doc = new DOMParser().parseFromString(html, 'text/html')
    
    if (!doc) {
      console.log('Failed to parse HTML')
      return activities
    }
    
    // Look for event cards (Eventbrite's structure may vary)
    const eventCards = doc.querySelectorAll('[data-testid="search-result-card"], .search-event-card, .event-card')
    console.log('Found event cards:', eventCards.length)
    
    for (const card of eventCards) {
      try {
        const titleElement = card.querySelector('h3, h2, .event-card__title, [data-testid="event-title"]')
        const title = titleElement?.textContent?.trim()
        
        const linkElement = card.querySelector('a[href*="/e/"]')
        const eventUrl = linkElement?.getAttribute('href')
        
        const locationElement = card.querySelector('.location, .event-card__location, [data-testid="event-location"]')
        const eventLocation = locationElement?.textContent?.trim()
        
        const dateElement = card.querySelector('.date, .event-card__date, [data-testid="event-date"]')
        const dateText = dateElement?.textContent?.trim()
        
        const priceElement = card.querySelector('.price, .event-card__price, [data-testid="event-price"]')
        const priceText = priceElement?.textContent?.trim()
        
        const imageElement = card.querySelector('img')
        const imageUrl = imageElement?.getAttribute('src')
        
        if (title && eventUrl) {
          const fullUrl = eventUrl.startsWith('http') ? eventUrl : `https://www.eventbrite.com${eventUrl}`
          
          // Extract price
          let price: number | null = null
          if (priceText) {
            const priceMatch = priceText.match(/[\d.]+/)
            if (priceMatch) {
              price = parseFloat(priceMatch[0])
            }
          }
          
          // Parse date
          let parsedDate = new Date().toISOString()
          if (dateText) {
            try {
              const date = new Date(dateText)
              if (!isNaN(date.getTime())) {
                parsedDate = date.toISOString()
              }
            } catch (e) {
              console.log('Failed to parse date:', dateText)
            }
          }
          
          activities.push({
            title,
            description: title, // Will be enhanced in detailed scraping
            location: eventLocation || location,
            date_time: parsedDate,
            price,
            age_group: 'all-ages',
            category: category || 'general',
            external_url: fullUrl,
            organizer: 'Eventbrite',
            image_url: imageUrl,
            tags: ['kids', 'family'],
          })
        }
      } catch (error) {
        console.log('Error parsing event card:', error)
      }
    }
  } catch (error) {
    console.error('Error scraping Eventbrite:', error)
  }
  
  return activities
}

async function scrapeMeetup(location: string, category: string): Promise<ScrapedActivity[]> {
  const activities: ScrapedActivity[] = []
  
  try {
    // Search for kids activities on Meetup
    const searchUrl = `https://www.meetup.com/find/?keywords=kids+children+family&location=${encodeURIComponent(location)}`
    console.log('Scraping Meetup URL:', searchUrl)
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      console.log('Meetup response not ok:', response.status)
      return activities
    }
    
    const html = await response.text()
    const doc = new DOMParser().parseFromString(html, 'text/html')
    
    if (!doc) {
      console.log('Failed to parse Meetup HTML')
      return activities
    }
    
    // Look for event cards
    const eventCards = doc.querySelectorAll('[data-testid="event-card"], .event-listing, .search-result')
    console.log('Found Meetup events:', eventCards.length)
    
    for (const card of eventCards) {
      try {
        const titleElement = card.querySelector('h3, h2, .event-title')
        const title = titleElement?.textContent?.trim()
        
        const linkElement = card.querySelector('a[href*="/events/"]')
        const eventUrl = linkElement?.getAttribute('href')
        
        const locationElement = card.querySelector('.venue-name, .location')
        const eventLocation = locationElement?.textContent?.trim()
        
        const dateElement = card.querySelector('.event-date, .date')
        const dateText = dateElement?.textContent?.trim()
        
        if (title && eventUrl) {
          const fullUrl = eventUrl.startsWith('http') ? eventUrl : `https://www.meetup.com${eventUrl}`
          
          let parsedDate = new Date().toISOString()
          if (dateText) {
            try {
              const date = new Date(dateText)
              if (!isNaN(date.getTime())) {
                parsedDate = date.toISOString()
              }
            } catch (e) {
              console.log('Failed to parse Meetup date:', dateText)
            }
          }
          
          activities.push({
            title,
            description: title,
            location: eventLocation || location,
            date_time: parsedDate,
            price: 0, // Most Meetup events are free
            age_group: 'all-ages',
            category: category || 'social',
            external_url: fullUrl,
            organizer: 'Meetup',
            tags: ['kids', 'family', 'meetup'],
          })
        }
      } catch (error) {
        console.log('Error parsing Meetup card:', error)
      }
    }
  } catch (error) {
    console.error('Error scraping Meetup:', error)
  }
  
  return activities
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { location = 'New York', category = 'general', sources = ['eventbrite', 'meetup'] } = await req.json()
    
    console.log('Scraping activities for:', { location, category, sources })
    
    const allActivities: ScrapedActivity[] = []
    
    // Scrape from different sources
    if (sources.includes('eventbrite')) {
      console.log('Scraping Eventbrite...')
      const eventbriteActivities = await scrapeEventbrite(location, category)
      allActivities.push(...eventbriteActivities)
      console.log('Found', eventbriteActivities.length, 'Eventbrite activities')
    }
    
    if (sources.includes('meetup')) {
      console.log('Scraping Meetup...')
      const meetupActivities = await scrapeMeetup(location, category)
      allActivities.push(...meetupActivities)
      console.log('Found', meetupActivities.length, 'Meetup activities')
    }
    
    console.log('Total activities found:', allActivities.length)
    
    // Save to database with geocoding
    if (allActivities.length > 0) {
      // Add coordinates to activities
      const activitiesWithCoords = await Promise.all(
        allActivities.map(async (activity) => {
          // Try to geocode the specific activity location, fall back to general location
          let locationToGeocode = activity.location;
          
          // If activity location is too generic or missing, use the search location
          if (!locationToGeocode || locationToGeocode.length < 3 || locationToGeocode === location) {
            locationToGeocode = location;
          }
          
          console.log(`Geocoding activity "${activity.title}" at location: "${locationToGeocode}"`);
          const coords = await geocodeLocation(locationToGeocode);
          
          if (coords) {
            console.log(`Successfully geocoded "${locationToGeocode}" to:`, coords);
          } else {
            console.log(`Failed to geocode "${locationToGeocode}", using fallback coordinates`);
            // Fallback: try to geocode just the search location
            const fallbackCoords = await geocodeLocation(location);
            if (fallbackCoords) {
              console.log(`Using fallback coordinates for ${location}:`, fallbackCoords);
            }
            return {
              ...activity,
              latitude: fallbackCoords?.lat || null,
              longitude: fallbackCoords?.lng || null,
              source: 'scraped',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
          }
          
          return {
            ...activity,
            latitude: coords.lat,
            longitude: coords.lng,
            source: 'scraped',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        })
      );
      
      // Insert into events table
      const { data: insertedData, error: insertError } = await supabaseClient
        .from('events')
        .upsert(activitiesWithCoords, { 
          onConflict: 'external_url',
          ignoreDuplicates: true 
        })
        .select()
      
      if (insertError) {
        console.error('Error inserting activities:', insertError)
        return new Response(
          JSON.stringify({ 
            error: 'Failed to save activities', 
            details: insertError.message,
            activities: allActivities 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      console.log('Successfully inserted', insertedData?.length || 0, 'activities')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          activities: allActivities,
          inserted: insertedData?.length || 0,
          eventsAdded: insertedData?.length || 0,
          message: `Successfully scraped and saved ${allActivities.length} activities`
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          success: true, 
          activities: [], 
          message: 'No activities found for the specified criteria' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
  } catch (error) {
    console.error('Error in scrape-activities function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})