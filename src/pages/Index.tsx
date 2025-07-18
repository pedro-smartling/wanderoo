import React, { useState } from 'react';
import WelcomeHeader from '@/components/WelcomeHeader';
import CategoryFilters from '@/components/CategoryFilters';
import WanderoSlotMachine from '@/components/WanderoSlotMachine';
import BottomNav from '@/components/BottomNav';
import ActivityCard from '@/components/ActivityCard';

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
  const [activeFilters, setActiveFilters] = useState<string[]>(['outdoors']);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [likedActivities, setLikedActivities] = useState<Activity[]>([]);
  const [spinCount, setSpinCount] = useState(3);
  const [activeTab, setActiveTab] = useState('home');

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
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Welcome Header */}
        <WelcomeHeader />

        {/* Category Filters */}
        <CategoryFilters 
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
        />

        {/* Wandero Slot Machine */}
        <WanderoSlotMachine
          activeFilters={activeFilters}
          onSpin={() => setSpinCount(prev => prev + 1)}
          onActivitySelect={handleActivitySelect}
          spinCount={spinCount}
        />

        {/* Activity Detail Card */}
        {selectedActivity && (
          <ActivityCard
            activity={selectedActivity}
            onClose={handleCloseCard}
            onLike={handleLike}
            onDislike={handleDislike}
            similarActivities={getSimilarActivities(selectedActivity)}
          />
        )}

        {/* Bottom Navigation */}
        <BottomNav 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default Index;
