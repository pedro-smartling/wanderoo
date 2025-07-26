import React, { useState, useEffect, useRef } from 'react';
import { Menu, Heart, MapPin, Star, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BottomNav from '@/components/BottomNav';
import ActivityCard from '@/components/ActivityCard';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useActivities, Activity } from '@/hooks/useActivities';

// Fix leaflet default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Category configuration with emojis
const categories = [
  { name: 'Museums', icon: '🏛️', color: 'bg-blue-100 text-blue-800' },
  { name: 'Playgrounds', icon: '🛝', color: 'bg-orange-100 text-orange-800' },
  { name: 'Sports', icon: '⚽', color: 'bg-green-100 text-green-800' },
  { name: 'Wildlife', icon: '🦋', color: 'bg-purple-100 text-purple-800' },
  { name: 'Nature', icon: '🌲', color: 'bg-emerald-100 text-emerald-800' }
];

// Cities for dropdown
const cities = [
  'Churwell, Leeds, UK',
  'City Centre, Leeds, UK', 
  'Headingley, Leeds, UK',
  'Roundhay, Leeds, UK',
  'Kirkstall, Leeds, UK'
];

// Component to update map center when location changes
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  
  return null;
};

// Custom marker component
const createCustomMarker = (activity: Activity) => {
  return divIcon({
    html: `
      <div style="
        width: 40px; 
        height: 40px; 
        background: white; 
        border-radius: 50%; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        display: flex; 
        align-items: center; 
        justify-content: center;
        font-size: 20px;
        border: 3px solid #FF6B35;
      ">
        ${activity.icon}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });
};

const Discover = () => {
  // Use shared activities hook
  const { 
    activities: allActivities, 
    refreshActivities: refreshSharedActivities,
    getActivitiesByCategory
  } = useActivities();
  
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isActivitySheetOpen, setIsActivitySheetOpen] = useState(false);
  const [isCitySheetOpen, setIsCitySheetOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState('Churwell, Leeds, UK');
  const [currentDate, setCurrentDate] = useState('Sat, 26 July 2025');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([53.8008, -1.5491]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(allActivities);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Filter activities when category changes
  useEffect(() => {
    if (selectedCategory) {
      setFilteredActivities(allActivities.filter(activity => activity.category === selectedCategory));
      } else {
      setFilteredActivities(allActivities);
    }
  }, [selectedCategory, allActivities]);

  // Function to refresh activities with new random ones
  const refreshActivities = () => {
    refreshSharedActivities();
    toast({
      title: "Activities Refreshed",
      description: "Discover new exciting activities in your area!",
    });
  };

  const handleMarkerClick = (activity: Activity) => {
    // Scroll to the corresponding card using scrollIntoView for more precise positioning
    const cardElement = document.getElementById(`activity-card-${activity.id}`);
    if (cardElement) {
      cardElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      
      // Add a brief highlight effect to make it clear which card was targeted
      cardElement.style.transform = 'scale(1.02)';
      cardElement.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      
      setTimeout(() => {
        cardElement.style.transform = '';
        cardElement.style.boxShadow = '';
      }, 800);
    }
  };

  const handleActivityCardClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsActivitySheetOpen(true);
  };

  const handleActivityAction = (activity: Activity, accepted: boolean) => {
    if (accepted) {
      // Save activity to calendar
    const savedActivities = JSON.parse(localStorage.getItem('approvedActivities') || '[]');
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
      localStorage.setItem('approvedActivities', JSON.stringify([...savedActivities, calendarActivity]));
      
      toast({
        title: "Added to Calendar",
        description: `${activity.title} has been added to your calendar`,
      });
    }
    
    setIsActivitySheetOpen(false);
    setSelectedActivity(null);
  };

  return (
    <div className="flex flex-col bg-white" style={{ height: '100% !important' }}>
      {/* Header - Not fixed, just normal flow */}
      <div className="flex-shrink-0 bg-white shadow-sm pt-11">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-[16px] font-semibold text-gray-900">{currentCity}</h1>
            <p className="text-[12px] text-gray-600">{currentDate}</p>
          </div>
          <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
              onClick={refreshActivities}
              className="p-1.5"
              title="Refresh activities"
          >
              <RefreshCw className="h-5 w-5 text-gray-700" />
          </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCitySheetOpen(true)}
              className="p-1.5"
              title="Settings"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
            </div>
        </div>

        {/* Category Filters */}
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium border transition-all ${
                  selectedCategory === category.name
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                } flex-shrink-0`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container - Takes remaining space */}
      <div className="flex-1 relative discover-map-container" style={{ minHeight: '560px !important' }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          className="w-full h-full discover-leaflet-map"
          style={{ borderRadius: '0', height: '100%', minHeight: '400px' }}
          zoomControl={false}
        >
          <MapUpdater center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
          />
          {filteredActivities.map((activity) => (
              <Marker
                key={activity.id}
              position={[activity.coordinates[0], activity.coordinates[1]]}
              icon={createCustomMarker(activity)}
              eventHandlers={{
                click: () => handleMarkerClick(activity)
              }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-1">{activity.title}</h3>
                    <p className="text-xs text-gray-600 mb-2">{activity.location}</p>
                    <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {activity.price === 0 ? 'Free' : `£${activity.price}`}
                    </span>
                    <span className="text-xs">★ {activity.rating}</span>
                    </div>
                  <Button
                    onClick={() => handleActivityCardClick(activity)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs py-1 px-2 rounded"
                    >
                    View Details
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>



      {/* Bottom Activity Cards */}
      <div 
        className="flex-shrink-0 h-[140px] bg-white border-t border-gray-100"
        style={{
          background: 'transparent',
          position: 'absolute',
          bottom: '100px',
          zIndex: 1000,
          border: 0,
          height: 'auto',
          width: '375px'
        }}
      >
        <div 
          ref={cardContainerRef}
          className="flex gap-3 overflow-x-auto px-3 py-3 h-full scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth'
          }}
        >
          {filteredActivities.map((activity) => (
            <Card
              key={activity.id}
              id={`activity-card-${activity.id}`}
              className="min-w-[250px] bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow flex-shrink-0"
              onClick={() => handleActivityCardClick(activity)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-[90px] object-cover rounded-t-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.error('Image failed to load:', activity.image);
                      // Fallback to a working Unsplash image
                      if (!target.src.includes('placeholder')) {
                        target.src = `https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=300&fit=crop&auto=format`;
                      } else {
                        // Ultimate fallback to a solid color placeholder
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkE0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                      }
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', activity.image);
                    }}
                    loading="lazy"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-white rounded-full"
                  >
                    <Heart className="h-3 w-3 text-gray-600" />
                  </Button>
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                    {activity.duration}
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-semibold text-[13px] text-gray-900 mb-1 leading-tight">
                    {activity.title}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[11px] font-medium text-gray-900">
                      {activity.rating}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      ({activity.reviews})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-gray-600">
                      <span className="text-[12px]">💰</span>
                      <span className="font-medium">
                        {activity.price === 0 ? 'Free' : `£${activity.price}`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* City/Date Selection Sheet */}
      <Sheet open={isCitySheetOpen} onOpenChange={setIsCitySheetOpen}>
        <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-left text-xl">Choose Location & Date</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select City
              </label>
              <Select value={currentCity} onValueChange={setCurrentCity}>
                <SelectTrigger className="w-full h-12 text-left">
                  <SelectValue placeholder="Choose a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                  </div>
                  
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Date
              </label>
              <Select value={currentDate} onValueChange={setCurrentDate}>
                <SelectTrigger className="w-full h-12 text-left">
                  <SelectValue placeholder="Choose a date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sat, 26 July 2025">Sat, 26 July 2025</SelectItem>
                  <SelectItem value="Sun, 27 July 2025">Sun, 27 July 2025</SelectItem>
                  <SelectItem value="Mon, 28 July 2025">Mon, 28 July 2025</SelectItem>
                  <SelectItem value="Tue, 29 July 2025">Tue, 29 July 2025</SelectItem>
                </SelectContent>
              </Select>
                </div>
                
            <Button 
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl"
              onClick={() => setIsCitySheetOpen(false)}
            >
              Update Location
                </Button>
              </div>
        </SheetContent>
      </Sheet>

      {/* Activity Detail Sheet */}
      {selectedActivity && (
        <ActivityCard
          activity={selectedActivity}
          onClose={() => {
            setIsActivitySheetOpen(false);
            setSelectedActivity(null);
          }}
          onLike={handleActivityAction}
          onDislike={() => {
            setIsActivitySheetOpen(false);
            setSelectedActivity(null);
          }}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Discover;