import { useState, useCallback } from 'react';

export interface Activity {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  coordinates: [number, number];
  image: string;
  duration: string;
  time: string;
  description: string;
  ageRange: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Dynamic Activity Generation System
const activityTemplates = {
  Museums: [
    {
      names: ['Leeds City Museum', 'Royal Armouries Museum', 'Thackray Medical Museum', 'Abbey House Museum', 'Leeds Art Gallery'],
      locations: ['Millennium Square, Leeds', 'Armouries Drive, Leeds', 'Beckett Street, Leeds', 'Abbey Walk, Leeds', 'The Headrow, Leeds'],
      descriptions: [
        'Explore the rich history through interactive exhibits and fascinating collections.',
        'Discover amazing artifacts and learn about culture and heritage.',
        'Interactive displays and educational experiences for all ages.',
        'Fascinating exhibitions showcasing local history and culture.',
        'Engaging displays with hands-on activities and learning opportunities.'
      ],
      baseCoordinates: [53.8001, -1.5491],
      icon: '🏛️',
      priceRange: [0, 12],
      durationOptions: ['2 Hours', '3 Hours', '2.5 Hours'],
      difficulties: ['Easy', 'Medium']
    }
  ],
  Playgrounds: [
    {
      names: ['Temple Newsam Playground', 'Roundhay Park Adventure', 'Meanwood Park Play Area', 'Hyde Park Corner Playground', 'Woodhouse Moor Play Zone'],
      locations: ['Temple Newsam, Leeds', 'Roundhay Park, Leeds', 'Meanwood Park, Leeds', 'Hyde Park, Leeds', 'Woodhouse Moor, Leeds'],
      descriptions: [
        'Adventure playground with slides, swings and climbing frames in beautiful parkland.',
        'Safe play area designed for children with exciting equipment and soft surfaces.',
        'Family-friendly playground with modern equipment and plenty of space to run around.',
        'Well-maintained play area perfect for active kids and outdoor fun.',
        'Exciting playground featuring climbing walls, tunnels and interactive play elements.'
      ],
      baseCoordinates: [53.7856, -1.4645],
      icon: '🛝',
      priceRange: [0, 8],
      durationOptions: ['1 Hour', '2 Hours', '1.5 Hours'],
      difficulties: ['Easy']
    }
  ],
  Sports: [
    {
      names: ['Roundhay Sports Centre', 'Leeds Tennis Academy', 'John Charles Centre', 'Gotts Park Golf', 'Pool Park Football'],
      locations: ['Roundhay Park, Leeds', 'Headingley, Leeds', 'South Leeds, Leeds', 'Armley, Leeds', 'Pool-in-Wharfedale, Leeds'],
      descriptions: [
        'Football training sessions and mini matches for young players.',
        'Professional coaching and fun sports activities for kids.',
        'Multi-sport activities including tennis, basketball and athletics.',
        'Indoor and outdoor sports facilities with qualified instructors.',
        'Age-appropriate sports programs focusing on fun and skill development.'
      ],
      baseCoordinates: [53.8267, -1.5167],
      icon: '⚽',
      priceRange: [10, 25],
      durationOptions: ['1 Hour', '1.5 Hours', '2 Hours'],
      difficulties: ['Easy', 'Medium']
    }
  ],
  Wildlife: [
    {
      names: ['Tropical World', 'Leeds Aquarium', 'Martin House Gardens', 'Kirkstall Nature Reserve', 'Temple Newsam Farm'],
      locations: ['Roundhay Park, Leeds', 'The Dock, Leeds', 'Wetherby Road, Leeds', 'Kirkstall, Leeds', 'Temple Newsam, Leeds'],
      descriptions: [
        'Indoor tropical gardens with exotic plants, butterflies and small animals.',
        'Amazing aquatic life and interactive marine experiences.',
        'Beautiful gardens with wildlife spotting and nature activities.',
        'Nature reserve with walking trails and wildlife observation.',
        'Working farm with friendly animals and educational activities.'
      ],
      baseCoordinates: [53.8289, -1.5134],
      icon: '🦋',
      priceRange: [5, 15],
      durationOptions: ['2 Hours', '2.5 Hours', '3 Hours'],
      difficulties: ['Easy']
    }
  ],
  Nature: [
    {
      names: ['Kirkstall Abbey Woods', 'Meanwood Valley Trail', 'Golden Acre Park', 'Adel Dam Nature Reserve', 'Yeadon Tarn'],
      locations: ['Kirkstall, Leeds', 'Meanwood, Leeds', 'Bramhope, Leeds', 'Adel, Leeds', 'Yeadon, Leeds'],
      descriptions: [
        'Nature walk through historic abbey ruins and woodland trails.',
        'Scenic walking trails with streams, wildlife and beautiful views.',
        'Perfect for nature spotting, walking and outdoor exploration.',
        'Peaceful nature reserve with walking paths and bird watching.',
        'Lake-side walks with waterfowl and family-friendly nature activities.'
      ],
      baseCoordinates: [53.8156, -1.5823],
      icon: '🌲',
      priceRange: [0, 5],
      durationOptions: ['1.5 Hours', '2 Hours', '3 Hours'],
      difficulties: ['Easy', 'Medium']
    }
  ],
  // Additional categories for slot machine compatibility
  Arts: [
    {
      names: ['Leeds Art Studio', 'Creative Kids Workshop', 'Painterly Expressions', 'Little Artists Corner', 'Craft Central Leeds'],
      locations: ['Leeds City Centre', 'Hyde Park, Leeds', 'Headingley, Leeds', 'Chapel Allerton, Leeds', 'Kirkstall, Leeds'],
      descriptions: [
        'Get messy and creative with colorful paints and art supplies!',
        'Hands-on crafting experiences perfect for young artists.',
        'Creative workshops featuring painting, drawing and sculpture.',
        'Art sessions designed to inspire creativity and imagination.',
        'Fun artistic activities with professional guidance and materials.'
      ],
      baseCoordinates: [53.8008, -1.5491],
      icon: '🎨',
      priceRange: [5, 18],
      durationOptions: ['1 Hour', '1.5 Hours', '2 Hours'],
      difficulties: ['Easy']
    }
  ],
  Indoors: [
    {
      names: ['Indoor Play Leeds', 'KidsZone Central', 'Little Explorers Indoor', 'Fun Factory Leeds', 'Adventure Indoors'],
      locations: ['Leeds Shopping Centre', 'Crossgates, Leeds', 'White Rose, Leeds', 'Kirkstall, Leeds', 'Pudsey, Leeds'],
      descriptions: [
        'Indoor playground with slides, ball pits and climbing areas.',
        'Safe indoor fun with soft play equipment and activities.',
        'Climate-controlled play area perfect for any weather.',
        'Indoor adventure zone with games and interactive play.',
        'Family-friendly indoor activities and entertainment.'
      ],
      baseCoordinates: [53.7977, -1.5437],
      icon: '🏠',
      priceRange: [6, 15],
      durationOptions: ['1.5 Hours', '2 Hours', '2.5 Hours'],
      difficulties: ['Easy']
    }
  ]
};

const timeSlots = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];
const ageRanges = ['2-6', '3-8', '4-10', '5-12', '6-14', '8-16'];
const unsplashImageIds = [
  'photo-1594736797933-d0c6ba2fe65f', // museum
  'photo-1544963150-22aef4f1ca91', // playground
  'photo-1571019613454-1cb2f99b2d8b', // sports
  'photo-1546026423-cc4642628d2b', // wildlife
  'photo-1441974231531-c6227db76b6e', // nature
  'photo-1513475382585-d06e58bcb0e0', // general activities
  'photo-1523712999610-f77fbcfc3843', // arts/crafts
  'photo-1581090464777-f3220bbe1b8b', // music
  'photo-1472396961693-142e6e269027', // outdoor activities
  'photo-1595950653106-6c9c43c665dd' // indoor play
];

// Utility functions for dynamic generation
const getRandomElement = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min: number, max: number, decimals: number = 1): number => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const generateCoordinates = (baseCoords: [number, number], radiusKm: number = 5): [number, number] => {
  // Generate random coordinates within a radius of the base coordinates
  const [baseLat, baseLng] = baseCoords;
  const earthRadius = 6371; // Earth's radius in km
  
  // Convert radius to degrees (roughly)
  const radiusDegrees = radiusKm / earthRadius * (180 / Math.PI);
  
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomRadius = Math.random() * radiusDegrees;
  
  const newLat = baseLat + randomRadius * Math.cos(randomAngle);
  const newLng = baseLng + randomRadius * Math.sin(randomAngle);
  
  return [parseFloat(newLat.toFixed(6)), parseFloat(newLng.toFixed(6))];
};

const generateActivity = (id: string, category: string): Activity => {
  const template = activityTemplates[category as keyof typeof activityTemplates][0];
  
  const name = getRandomElement(template.names);
  const location = getRandomElement(template.locations);
  const description = getRandomElement(template.descriptions);
  const duration = getRandomElement(template.durationOptions);
  
  // Generate more realistic times based on current time
  const currentHour = new Date().getHours();
  let availableTimes = timeSlots;
  
  // Filter times to be more realistic (only future times if it's still today)
  if (currentHour < 16) {
    availableTimes = timeSlots.filter(time => {
      const timeHour = parseInt(time.split(':')[0]);
      const isPM = time.includes('PM');
      const hour24 = isPM && timeHour !== 12 ? timeHour + 12 : (!isPM && timeHour === 12 ? 0 : timeHour);
      return hour24 >= currentHour;
    });
  }
  
  const time = getRandomElement(availableTimes.length > 0 ? availableTimes : timeSlots);
  const ageRange = getRandomElement(ageRanges);
  const difficulty = getRandomElement(template.difficulties);
  const price = getRandomNumber(template.priceRange[0], template.priceRange[1]);
  const rating = getRandomFloat(4.3, 5.0, 1);
  const reviews = getRandomNumber(15, 500);
  const coordinates = generateCoordinates(template.baseCoordinates as [number, number]);
  const imageId = getRandomElement(unsplashImageIds);
  
  return {
    id,
    title: name,
    category,
    price,
    rating,
    reviews,
    location,
    coordinates,
    image: `https://images.unsplash.com/${imageId}?w=400&h=300&fit=crop&auto=format`,
    duration,
    time,
    description,
    ageRange,
    icon: template.icon,
    difficulty: difficulty as 'Easy' | 'Medium' | 'Hard'
  };
};

const generateActivities = (count: number = 20): Activity[] => {
  const activities: Activity[] = [];
  const categoryKeys = Object.keys(activityTemplates);
  
  for (let i = 0; i < count; i++) {
    const category = getRandomElement(categoryKeys);
    const activity = generateActivity(`dynamic-${i + 1}`, category);
    activities.push(activity);
  }
  
  // Sort by rating to put higher rated activities first
  return activities.sort((a, b) => b.rating - a.rating);
};

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>(() => generateActivities(18));

  const refreshActivities = useCallback(() => {
    const newActivities = generateActivities(18);
    setActivities(newActivities);
    return newActivities;
  }, []);

  // Get activities filtered by category
  const getActivitiesByCategory = useCallback((category?: string) => {
    if (!category) return activities;
    return activities.filter(activity => activity.category === category);
  }, [activities]);

  // Get activities compatible with slot machine legacy categories
  const getActivitiesForSlotMachine = useCallback((activeFilters: string[]) => {
    if (activeFilters.length === 0) return activities;
    
    // Map slot machine legacy categories to new categories
    const categoryMap: Record<string, string[]> = {
      'outdoors': ['Nature', 'Sports', 'Playgrounds'],
      'arts': ['Arts', 'Museums'],
      'indoors': ['Indoors', 'Museums']
    };
    
    const matchingCategories = activeFilters.flatMap(filter => 
      categoryMap[filter.toLowerCase()] || []
    );
    
    if (matchingCategories.length === 0) return activities;
    
    return activities.filter(activity => 
      matchingCategories.includes(activity.category)
    );
  }, [activities]);

  return {
    activities,
    refreshActivities,
    getActivitiesByCategory,
    getActivitiesForSlotMachine
  };
}; 