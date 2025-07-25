import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeHeader from '@/components/WelcomeHeader';
import CategoryFilters from '@/components/CategoryFilters';
import WanderoSlotMachine from '@/components/WanderoSlotMachine';
import BottomNav from '@/components/BottomNav';
import ActivityCard from '@/components/ActivityCard';
import { Button } from '@/components/ui/button';

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
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState<string[]>(['outdoors']);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [likedActivities, setLikedActivities] = useState<Activity[]>([]);
  const [spinCount, setSpinCount] = useState(3);
  const [activeTab, setActiveTab] = useState('home');
  const [reviewQueue, setReviewQueue] = useState<Activity[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewedActivities, setReviewedActivities] = useState<{activity: Activity, accepted: boolean}[]>([]);
  const [isSlotMachineActive, setIsSlotMachineActive] = useState(false);

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

  const handleSpinClick = () => {
    setIsSlotMachineActive(true);
    setSpinCount(prev => prev + 1);
  };

  const handleActivitySelect = (activities: Activity[]) => {
    // Start the review queue with all 3 activities
    setReviewQueue(activities);
    setCurrentReviewIndex(0);
    setReviewedActivities([]);
    setSelectedActivity(activities[0]);
    setIsSlotMachineActive(false);
  };

  const handleSlotMachineClose = () => {
    setIsSlotMachineActive(false);
  };

  const handleLike = (activity: Activity, accepted: boolean) => {
    // Add to reviewed activities
    const newReviewed = [...reviewedActivities, { activity, accepted }];
    setReviewedActivities(newReviewed);
    
    if (accepted) {
      setLikedActivities(prev => [...prev, activity]);
    }
    
    // Move to next activity or finish
    if (currentReviewIndex < reviewQueue.length - 1) {
      const nextIndex = currentReviewIndex + 1;
      setCurrentReviewIndex(nextIndex);
      setSelectedActivity(reviewQueue[nextIndex]);
    } else {
      // All activities reviewed, save accepted ones to calendar
      const acceptedActivities = newReviewed.filter(r => r.accepted).map(r => r.activity);
      
      if (acceptedActivities.length > 0) {
        const savedActivities = JSON.parse(localStorage.getItem('approvedActivities') || '[]');
        const calendarActivities = acceptedActivities.map((activity, index) => ({
          id: `reviewed-${activity.id}-${Date.now()}-${index}`,
          time: activity.time,
          title: activity.title,
          description: activity.description,
          completed: false,
          color: ['yellow', 'blue', 'green'][index % 3] as 'yellow' | 'blue' | 'green',
          category: activity.category,
          location: activity.location,
          duration: activity.duration
        }));
        
        localStorage.setItem('approvedActivities', JSON.stringify([...savedActivities, ...calendarActivities]));
        
        // Navigate to calendar
        window.location.href = '/calendar';
      } else {
        // No activities accepted, just close
        handleCloseCard();
      }
    }
  };

  const handleDislike = (activity: Activity) => {
    // Handle as rejection
    handleLike(activity, false);
  };

  const handleCloseCard = () => {
    setSelectedActivity(null);
    setReviewQueue([]);
    setCurrentReviewIndex(0);
    setReviewedActivities([]);
  };

  React.useEffect(() => {
    // Listen for spin events to update spin count
    const handleSpinEvent = () => {
      setSpinCount(prev => prev + 1);
    };
    
    // You could implement a custom event system here
    return () => {};
  }, []);

  // If slot machine is active, render only the slot machine
  if (isSlotMachineActive) {
    return (
      <WanderoSlotMachine
        activeFilters={activeFilters}
        onSpin={handleSpinClick}
        onActivitySelect={handleActivitySelect}
        onClose={handleSlotMachineClose}
        spinCount={spinCount}
      />
    );
  }

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

        {/* Spin My Day Button - replaces the slot machine component */}
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Ready for an Adventure?</h2>
            <p className="text-muted-foreground mb-6">
              Spin the wheel and let us create the perfect day for you!
            </p>
            <Button
              onClick={handleSpinClick}
              className="bg-gradient-to-r from-[#FD9A55] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FF4500] text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              🎰 SPIN MY DAY
            </Button>
          </div>
        </div>

        {/* Activity Detail Card */}
        {selectedActivity && (
          <ActivityCard
            activity={selectedActivity}
            onClose={handleCloseCard}
            onLike={handleLike}
            onDislike={handleDislike}
            similarActivities={getSimilarActivities(selectedActivity)}
            currentIndex={currentReviewIndex}
            totalCount={reviewQueue.length}
            isReviewFlow={reviewQueue.length > 0}
          />
        )}

        {/* Bottom Navigation */}
        <BottomNav 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSpinClick={handleSpinClick}
        />
      </div>

    </div>
  );
};

export default Index;
