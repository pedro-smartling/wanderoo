import React, { useState } from 'react';
import GameSlotMachine from '@/components/GameSlotMachine';
import FilterControls from '@/components/FilterControls';
import ActivityCard from '@/components/ActivityCard';
import RewardSystem from '@/components/RewardSystem';
import GameHeader from '@/components/GameHeader';
import BottomNavigation from '@/components/BottomNavigation';

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
  const [currentTab, setCurrentTab] = useState('home');

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
    <div className="min-h-screen bg-gradient-to-br from-game-green via-game-green-light to-accent">
      {/* Game Header */}
      <GameHeader 
        title="Adventure Quest"
        showBack={false}
        showMenu={true}
      />
      
      {/* Main Content */}
      <div className="px-4 pb-24 -mt-6 relative z-10">
        <div className="bg-white rounded-t-3xl p-6 shadow-soft min-h-[calc(100vh-12rem)]">
          {currentTab === 'home' && (
            <>
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

              {/* Game Slot Machine */}
              <GameSlotMachine 
                onActivitySelect={handleActivitySelect}
                activeFilters={activeFilters}
                onSpin={() => setSpinCount(prev => prev + 1)}
              />
            </>
          )}
          
          {currentTab === 'lessons' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-xl font-bold text-game-green mb-2">Lessons Coming Soon!</h2>
              <p className="text-muted-foreground">Interactive learning experiences</p>
            </div>
          )}
          
          {currentTab === 'achievements' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-xl font-bold text-game-green mb-2">Your Achievements</h2>
              <p className="text-muted-foreground">Collect badges and unlock rewards</p>
            </div>
          )}
          
          {currentTab === 'profile' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👤</div>
              <h2 className="text-xl font-bold text-game-green mb-2">Your Profile</h2>
              <p className="text-muted-foreground">Customize your adventure settings</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={currentTab}
        onTabChange={setCurrentTab}
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
    </div>
  );
};

export default Index;
