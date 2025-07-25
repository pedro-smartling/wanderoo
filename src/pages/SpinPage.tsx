import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WanderoSlotMachine from '@/components/WanderoSlotMachine';
import ActivityCard from '@/components/ActivityCard';
import { useActivities, Activity } from '@/hooks/useActivities';



const SpinPage = () => {
  const navigate = useNavigate();
  const { getActivitiesForSlotMachine } = useActivities();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [reviewQueue, setReviewQueue] = useState<Activity[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviewedActivities, setReviewedActivities] = useState<{activity: Activity, accepted: boolean}[]>([]);

  const getSimilarActivities = (activity: Activity): Activity[] => {
    // Mock similar activities - in a real app this would come from an API
    return [];
  };

  const handleActivitySelect = (activities: Activity[]) => {
    // Start the review queue with all activities
    setReviewQueue(activities);
    setCurrentReviewIndex(0);
    setReviewedActivities([]);
    setSelectedActivity(activities[0]);
  };

  const handleLike = (activity: Activity, accepted: boolean) => {
    // Add to reviewed activities
    const newReviewed = [...reviewedActivities, { activity, accepted }];
    setReviewedActivities(newReviewed);
    
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
        navigate('/calendar');
      } else {
        // No activities accepted, just close
        handleCloseCard();
        // Navigate back to home if no activities were accepted
        setTimeout(() => {
          navigate('/home');
        }, 500);
      }
    }
  };

  const handleDislike = (activity: Activity) => {
    handleLike(activity, false);
  };

  const handleCloseCard = () => {
    setSelectedActivity(null);
    setReviewQueue([]);
    setCurrentReviewIndex(0);
    setReviewedActivities([]);
  };

  const handleClose = () => {
    navigate('/home');
  };

  return (
    <div className="relative h-full w-full">
      <WanderoSlotMachine 
        activities={getActivitiesForSlotMachine(['outdoors'])}
        activeFilters={['outdoors']} 
        onSpin={() => {}} 
        onActivitySelect={handleActivitySelect}
        onClose={handleClose} 
        spinCount={0} 
      />
      
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
    </div>
  );
};

export default SpinPage; 