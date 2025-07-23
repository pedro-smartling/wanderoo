import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Filter, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import BottomNav from '@/components/BottomNav';
import { ActivityScraper } from '@/components/ActivityScraper';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock kid-friendly activity data with Leeds locations
const mockActivities = [
  {
    id: '1',
    title: 'Mini Art Workshop',
    category: 'Creative',
    price: 15,
    rating: 4.8,
    reviews: 23,
    location: 'Leeds Children\'s Art Centre',
    coordinates: [-1.492000, 53.833000],
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0',
    duration: '1 hour',
    time: '10:00 AM',
    description: 'Fun painting and drawing activities for children aged 3-8',
    ageRange: '3-8'
  },
  {
    id: '2',
    title: 'Interactive Science Show',
    category: 'Educational',
    price: 20,
    rating: 4.9,
    reviews: 45,
    location: 'Thackray Medical Museum',
    coordinates: [-1.548567, 53.799722],
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
    duration: '45 minutes',
    time: '2:00 PM',
    description: 'Exciting science experiments and demonstrations for curious minds',
    ageRange: '4-12'
  },
  {
    id: '3',
    title: 'Soft Play Adventure',
    category: 'Indoor Play',
    price: 12,
    rating: 4.7,
    reviews: 31,
    location: 'Jungle Mania Leeds',
    coordinates: [-1.540000, 53.797000],
    image: 'https://images.unsplash.com/photo-1595950653106-6c9c43c665dd',
    duration: '2 hours',
    time: '11:00 AM',
    description: 'Safe soft play area with slides, ball pits and climbing frames',
    ageRange: '2-8'
  },
  {
    id: '4',
    title: 'Kids Cooking Class',
    category: 'Culinary',
    price: 25,
    rating: 5.0,
    reviews: 67,
    location: 'Little Chef Academy',
    coordinates: [-1.548567, 53.799722],
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3',
    duration: '1.5 hours',
    time: '3:30 PM',
    description: 'Simple cooking activities making healthy snacks and treats',
    ageRange: '5-12'
  },
  {
    id: '5',
    title: 'Nature Walk & Games',
    category: 'Outdoors',
    price: 8,
    rating: 4.6,
    reviews: 89,
    location: 'Roundhay Park',
    coordinates: [-1.570000, 53.810000],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    duration: '1.5 hours',
    time: '9:00 AM',
    description: 'Guided nature walk with fun outdoor games and activities',
    ageRange: '3-10'
  },
  {
    id: '6',
    title: 'Music & Movement',
    category: 'Music',
    price: 18,
    rating: 4.8,
    reviews: 42,
    location: 'Leeds Music Centre',
    coordinates: [-1.546000, 53.802000],
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
    duration: '45 minutes',
    time: '4:00 PM',
    description: 'Interactive music session with singing, dancing and instruments',
    ageRange: '2-6'
  }
];

// Category icon mapping for kids activities
const categoryIcons = {
  'Creative': '🎨',
  'Educational': '🔬',
  'Indoor Play': '🏰',
  'Culinary': '👨‍🍳',
  'Outdoors': '🌳',
  'Music': '🎵',
  'Sports': '⚽'
};

const categories = ['All', 'Creative', 'Educational', 'Indoor Play', 'Culinary', 'Outdoors', 'Music', 'Sports'];

// Component to update map center when location changes
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  
  return null;
};

// Geocoding function using OpenStreetMap Nominatim API (free)
const geocodeLocation = async (location: string): Promise<[number, number] | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Function to get city suggestions for autocomplete
const getCitySuggestions = async (query: string): Promise<Array<{name: string, display: string}>> => {
  if (!query.trim() || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&extratags=1&namedetails=1&type=city,town,village`
    );
    const data = await response.json();
    
    return data.map((item: any) => ({
      name: item.name || item.display_name.split(',')[0],
      display: item.display_name
    }));
  } catch (error) {
    console.error('City suggestions error:', error);
    return [];
  }
};

const Discover = () => {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('Leeds');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredActivities, setFilteredActivities] = useState(mockActivities);
  const [realActivities, setRealActivities] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([53.8008, -1.5491]); // Leeds coordinates
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<Array<{name: string, display: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Load activities from database on component mount
  useEffect(() => {
    loadActivitiesFromDatabase();
  }, []);

  // Filter activities when category changes
  useEffect(() => {
    const allActivities = [...mockActivities, ...realActivities];
    const filtered = selectedCategory === 'All' 
      ? allActivities 
      : allActivities.filter(activity => activity.category === selectedCategory);
    setFilteredActivities(filtered);
  }, [selectedCategory, realActivities]);

  const loadActivitiesFromDatabase = async () => {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading activities:', error);
        return;
      }

      if (events && events.length > 0) {
        console.log('Found events in database:', events.length);
        
        // Transform database events to match the expected format and use their coordinates
        const transformedActivities = events.map(event => {
          // Use database coordinates if available, otherwise geocode the location
          let coordinates = [-1.5491, 53.8008]; // Default to Leeds coordinates
          
          if (event.latitude && event.longitude) {
            coordinates = [event.longitude, event.latitude]; // [lng, lat] format for leaflet
          }
          
          return {
            id: event.id,
            title: event.title,
            category: event.category,
            price: event.price || 0,
            rating: 4.5, // Default rating
            reviews: Math.floor(Math.random() * 100) + 10, // Random reviews for demo
            location: event.location || 'Location TBD',
            coordinates,
            image: event.image_url || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0',
            duration: event.duration_minutes ? `${event.duration_minutes} minutes` : '1 hour',
            time: event.date_time ? new Date(event.date_time).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }) : '10:00 AM',
            description: event.description || 'Fun activity for kids',
            ageRange: event.age_group || '3-12'
          };
        });

        setRealActivities(transformedActivities);
        console.log('Loaded activities with coordinates:', transformedActivities.map(a => ({ title: a.title, coordinates: a.coordinates })));
      } else {
        console.log('No events found in database');
        setRealActivities([]);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  // Effect to handle location search with debouncing and activity fetching
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (searchLocation.trim() && searchLocation.trim() !== '') {
        setIsSearching(true);
        const coordinates = await geocodeLocation(searchLocation);
        if (coordinates) {
          setMapCenter(coordinates);
          // Fetch activities for the new location
          await fetchActivitiesForLocation(searchLocation);
        }
        setIsSearching(false);
      }
    }, 1000); // 1 second debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchLocation]);

  const fetchActivitiesForLocation = async (location: string) => {
    setIsLoadingActivities(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-activities', {
        body: { location }
      });

      if (error) {
        console.error('Error fetching activities:', error);
        toast({
          title: "Error",
          description: "Failed to fetch activities for this location",
          variant: "destructive",
        });
        return;
      }

      if (data?.success) {
        toast({
          title: "Success",
          description: `Found ${data.eventsAdded || 0} new activities in ${location}`,
        });
        // Reload activities from database to get the new ones
        await loadActivitiesFromDatabase();
      }
    } catch (error) {
      console.error('Error calling scrape function:', error);
      toast({
        title: "Error",
        description: "Failed to fetch activities for this location",
        variant: "destructive",
      });
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // Effect to handle autocomplete suggestions with debouncing
  useEffect(() => {
    if (suggestionTimeoutRef.current) {
      clearTimeout(suggestionTimeoutRef.current);
    }

    suggestionTimeoutRef.current = setTimeout(async () => {
      if (searchLocation.trim() && searchLocation.length >= 2) {
        const suggestions = await getCitySuggestions(searchLocation);
        setCitySuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } else {
        setCitySuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // Shorter debounce for suggestions

    return () => {
      if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
      }
    };
  }, [searchLocation]);

  const handleSuggestionClick = (suggestion: {name: string, display: string}) => {
    setSearchLocation(suggestion.name);
    setShowSuggestions(false);
    setCitySuggestions([]);
  };

  const handleSearchFocus = () => {
    if (citySuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
    setIsSheetOpen(true);
  };

  const saveActivityWithConflictResolution = (activity: any) => {
    const savedActivities = JSON.parse(localStorage.getItem('approvedActivities') || '[]');
    
    // Filter out activities with the same time to avoid conflicts
    const filteredActivities = savedActivities.filter((savedActivity: any) => {
      return savedActivity.time !== activity.time;
    });
    
    // Create calendar activity object
    const calendarActivity = {
      id: `discover-${activity.id}-${Date.now()}`,
      time: activity.time,
      title: activity.title,
      description: activity.description,
      completed: false,
      color: 'blue' as 'yellow' | 'blue' | 'green',
      category: activity.category,
      location: activity.location,
      duration: activity.duration
    };
    
    // Add the new activity
    localStorage.setItem('approvedActivities', JSON.stringify([...filteredActivities, calendarActivity]));
    
    return true;
  };

  const handleAddToCalendar = () => {
    if (!selectedActivity) return;
    
    const saved = saveActivityWithConflictResolution(selectedActivity);
    
    if (saved) {
      // Close the sheet and navigate to calendar
      setIsSheetOpen(false);
      setSelectedActivity(null);
      
      // Navigate to calendar page
      window.location.href = '/calendar';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search Header */}
      <div className="bg-background border-b border-border p-4 space-y-4">
        {/* Location Search */}
        <div className="relative">
          {isSearching || isLoadingActivities ? (
            <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
          ) : (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
          <Input
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            placeholder="Search for a city or location..."
            className="pl-10 bg-muted border-0"
            disabled={isSearching || isLoadingActivities}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Filter className="h-4 w-4" />
          </Button>
          
          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && citySuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-[9999] mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {citySuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-3 cursor-pointer hover:bg-muted transition-colors border-b border-border last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-medium text-sm">{suggestion.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{suggestion.display}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className={`whitespace-nowrap cursor-pointer px-4 py-2 ${
                selectedCategory === category 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1" style={{ height: 'calc(100vh - 200px)' }}>
        <MapContainer
          center={mapCenter}
          zoom={12}
          className="w-full h-full"
          style={{ borderRadius: '0' }}
        >
          <MapUpdater center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredActivities.map((activity) => {
            console.log('Rendering marker for activity:', activity.title, 'at coordinates:', activity.coordinates);
            return (
              <Marker
                key={activity.id}
                position={[activity.coordinates[1], activity.coordinates[0]]}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-1">{activity.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">{activity.location}</p>
                    <p className="text-xs mb-2">{activity.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">£{activity.price}</span>
                      <span className="text-xs">★ {activity.rating} ({activity.reviews})</span>
                    </div>
                    <button
                      onClick={() => handleActivityClick(activity)}
                      className="w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors"
                    >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
            );
          })}
        </MapContainer>
        
        {/* Activity Count & Status */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
            {isLoadingActivities ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">Finding activities in {searchLocation}...</span>
              </div>
            ) : (
              <span className="text-sm font-medium">
                {filteredActivities.length} activities in {searchLocation}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Activity Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          {selectedActivity && (
            <>
              <SheetHeader className="pb-4">
                <SheetTitle className="text-left">{selectedActivity.title}</SheetTitle>
                <div className="text-sm text-muted-foreground">
                  Perfect for kids aged {(selectedActivity as any).ageRange}
                </div>
              </SheetHeader>
              
              <div className="space-y-4 overflow-y-auto">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={selectedActivity.image}
                    alt={selectedActivity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">£{selectedActivity.price}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">★ {selectedActivity.rating}</span>
                      <span className="text-sm text-muted-foreground">({selectedActivity.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedActivity.location}</span>
                    <span>•</span>
                    <span>{selectedActivity.duration}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedActivity.description}
                  </p>
                  
                  <Badge variant="secondary" className="w-fit">
                    {selectedActivity.category}
                  </Badge>
                </div>
                
                <Button className="w-full mt-6" onClick={handleAddToCalendar}>
                  Add to Calendar
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Activity Scraper Component */}
      <div className="p-4">
        <ActivityScraper />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Discover;