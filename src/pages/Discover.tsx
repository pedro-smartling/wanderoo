import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search, MapPin, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import BottomNav from '@/components/BottomNav';

// Mock activity data with locations
const mockActivities = [
  {
    id: '1',
    title: 'Photography Workshop',
    category: 'Creative',
    price: 45,
    rating: 4.8,
    reviews: 23,
    location: 'Central Park',
    coordinates: [-73.968285, 40.785091],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    duration: '2 hours',
    description: 'Learn photography basics in beautiful Central Park'
  },
  {
    id: '2',
    title: 'Art Museum Tour',
    category: 'Cultural',
    price: 32,
    rating: 4.9,
    reviews: 45,
    location: 'Metropolitan Museum',
    coordinates: [-73.963244, 40.779437],
    image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd',
    duration: '3 hours',
    description: 'Guided tour through world-class art collections'
  },
  {
    id: '3',
    title: 'Rock Climbing',
    category: 'Adventure',
    price: 65,
    rating: 4.7,
    reviews: 31,
    location: 'Brooklyn Bridge Park',
    coordinates: [-73.996736, 40.702323],
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851',
    duration: '4 hours',
    description: 'Indoor rock climbing with professional instruction'
  },
  {
    id: '4',
    title: 'Cooking Class',
    category: 'Culinary',
    price: 78,
    rating: 5.0,
    reviews: 67,
    location: 'Little Italy',
    coordinates: [-73.997762, 40.719720],
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    duration: '2.5 hours',
    description: 'Learn to make authentic Italian pasta from scratch'
  },
  {
    id: '5',
    title: 'Yoga in the Park',
    category: 'Wellness',
    price: 25,
    rating: 4.6,
    reviews: 89,
    location: 'Prospect Park',
    coordinates: [-73.969077, 40.660204],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    duration: '1 hour',
    description: 'Morning yoga session in peaceful park setting'
  },
  {
    id: '6',
    title: 'Jazz Club Night',
    category: 'Music',
    price: 55,
    rating: 4.8,
    reviews: 42,
    location: 'Greenwich Village',
    coordinates: [-74.002950, 40.731581],
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
    duration: '3 hours',
    description: 'Live jazz performance with cocktails'
  }
];

const categories = ['All', 'Creative', 'Cultural', 'Adventure', 'Culinary', 'Wellness', 'Music', 'Outdoors', 'Sports'];

const Discover = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('New York');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredActivities, setFilteredActivities] = useState(mockActivities);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY2x3ZWJ6dXNkMWxtbjJxbXQ4dnFmbTJ6ciJ9.VfTjDQIl3VBt9CTc_vfBWg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-73.968285, 40.785091], // NYC center
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for activities
    filteredActivities.forEach((activity) => {
      const markerEl = document.createElement('div');
      markerEl.className = 'activity-marker';
      markerEl.innerHTML = `
        <div class="bg-background border border-border rounded-full px-3 py-1 shadow-lg cursor-pointer hover:scale-110 transition-transform">
          <span class="text-sm font-semibold text-foreground">$${activity.price}</span>
        </div>
      `;
      
      markerEl.addEventListener('click', () => {
        setSelectedActivity(activity);
        setIsSheetOpen(true);
      });

      new mapboxgl.Marker(markerEl)
        .setLngLat(activity.coordinates as [number, number])
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [filteredActivities]);

  useEffect(() => {
    const filtered = selectedCategory === 'All' 
      ? mockActivities 
      : mockActivities.filter(activity => activity.category === selectedCategory);
    setFilteredActivities(filtered);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Search Header */}
      <div className="bg-background border-b border-border p-4 space-y-4">
        {/* Location Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search location..."
            className="pl-10 bg-muted border-0"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Filter className="h-4 w-4" />
          </Button>
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
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Activity Count */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
            <span className="text-sm font-medium">Over 1,000 activities in {searchLocation}</span>
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
                    <span className="text-lg font-semibold">${selectedActivity.price}</span>
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
                
                <Button className="w-full mt-6">
                  Book Activity
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Discover;