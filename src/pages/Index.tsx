import React, { useState } from 'react';
import JackpotSlotMachine from '@/components/JackpotSlotMachine';
import FilterControls from '@/components/FilterControls';
import ActivityCard from '@/components/ActivityCard';
import RewardSystem from '@/components/RewardSystem';

interface Activity {
  id: string;
  title: string;
  time: string;
  category: string;
  icon: string;
  location: string;
  duration: string;
  description: string;
  image: string;
  rating: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const Index = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [likedActivities, setLikedActivities] = useState<Activity[]>([]);
  const [spinCount, setSpinCount] = useState(0);

  // Mock similar activities for the Tinder-style cards
  const getSimilarActivities = (activity: Activity): Activity[] => {
    const mockSimilar: Activity[] = [
      {
        id: 'sim1',
        title: 'Forest Photography Walk',
        time: '9:00 AM',
        category: 'Outdoors',
        icon: '📸',
        location: 'Pine Forest Trail',
        duration: '2.5 hours',
        description: 'Capture the beauty of nature while learning photography basics. Perfect for creative minds!',
        image: 'photo-1523712999610-f77fbcfc3843',
        rating: 4.6,
        difficulty: 'Easy'
      },
      {
        id: 'sim2',
        title: 'Garden Discovery Tour',
        time: '2:30 PM',
        category: 'Outdoors',
        icon: '🌺',
        location: 'Botanical Gardens',
        duration: '1.5 hours',
        description: 'Explore exotic plants and learn about different flowers from around the world.',
        image: 'photo-1500673922987-e212871fec22',
        rating: 4.7,
        difficulty: 'Easy'
      }
    ];
    
    return mockSimilar.filter(similar => 
      similar.category === activity.category && similar.id !== activity.id
    );
  };

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handleLike = (activity: Activity) => {
    setLikedActivities(prev => [...prev, activity]);
  };

  const handleDislike = (activity: Activity) => {
    // Handle dislike - could store for learning preferences
    console.log('Disliked:', activity.title);
  };

  const handleCloseCard = () => {
    setSelectedActivity(null);
  };

  React.useEffect(() => {
    // Listen for spin events to update spin count
    const handleSpinEvent = () => {
      setSpinCount(prev => prev + 1);
    };
    
    // You could implement a custom event system here
    return () => {};
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Reward System */}
        <RewardSystem 
          spinCount={spinCount} 
          likedActivities={likedActivities.length} 
        />

        {/* Filter Controls */}
        <FilterControls 
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
        />

        {/* Jackpot Slot Machine */}
        <JackpotSlotMachine 
          onActivitySelect={handleActivitySelect}
          activeFilters={activeFilters}
          onSpin={() => setSpinCount(prev => prev + 1)}
        />

        {/* Activity Detail Card (Tinder Style) */}
        {selectedActivity && (
          <ActivityCard
            activity={selectedActivity}
            onClose={handleCloseCard}
            onLike={handleLike}
            onDislike={handleDislike}
            similarActivities={getSimilarActivities(selectedActivity)}
          />
        )}

        {/* Footer */}
        <div className="text-center mt-8 pb-6">
          <p className="text-xs text-muted-foreground">
            Swipe through activities • Find your perfect day! 🌟
          </p>
          {likedActivities.length > 0 && (
            <p className="text-xs text-primary mt-1">
              {likedActivities.length} activities in your favorites ❤️
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
