import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import BottomNav from '@/components/BottomNav';

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

const Discover = () => {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState('Leeds');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredActivities, setFilteredActivities] = useState(mockActivities);

  useEffect(() => {
    const filtered = selectedCategory === 'All' 
      ? mockActivities 
      : mockActivities.filter(activity => activity.category === selectedCategory);
    setFilteredActivities(filtered);
  }, [selectedCategory]);

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity);
    setIsSheetOpen(true);
  };

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
        <div className="w-full h-full bg-muted flex flex-col items-center justify-center relative">
          {/* Map Header */}
          <div className="text-center space-y-4 z-10">
            <div className="text-6xl">🗺️</div>
            <div className="text-lg font-semibold">Leeds Kids Activities Map</div>
            <div className="text-sm text-muted-foreground">Tap the icons to explore activities</div>
          </div>
          
          {/* Activity Markers Grid */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-4 p-8">
            {filteredActivities.map((activity, index) => {
              const categoryIcon = categoryIcons[activity.category as keyof typeof categoryIcons] || '📍';
              const positions = [
                'col-start-1 row-start-1', 
                'col-start-3 row-start-1', 
                'col-start-2 row-start-2',
                'col-start-1 row-start-3', 
                'col-start-3 row-start-3', 
                'col-start-2 row-start-1'
              ];
              const position = positions[index % positions.length];
              
              return (
                <div 
                  key={activity.id}
                  className={`flex justify-center items-center ${position}`}
                >
                  <div 
                    className="bg-background border border-border rounded-full w-12 h-12 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => handleActivityClick(activity)}
                  >
                    <span className="text-lg">{categoryIcon}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Activity Count */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-background/90 backdrop-blur-sm border border-border rounded-full px-4 py-2 shadow-lg">
            <span className="text-sm font-medium">Over 1,000 kids activities in {searchLocation}</span>
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
                
                <Button className="w-full mt-6">
                  Book Kids Activity
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