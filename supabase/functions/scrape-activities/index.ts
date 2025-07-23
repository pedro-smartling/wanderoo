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

// Geocoding function using OpenStreetMap Nominatim API
async function geocodeLocation(location: string): Promise<{ lat: number, lng: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
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
    
    // Save to database
    if (allActivities.length > 0) {
      // Prepare data for insertion
      const activitiesData = allActivities.map(activity => ({
        ...activity,
        source: 'scraped',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
      
      // Insert into events table
      const { data: insertedData, error: insertError } = await supabaseClient
        .from('events')
        .upsert(activitiesData, { 
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