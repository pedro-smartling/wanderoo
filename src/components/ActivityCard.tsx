import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

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

interface ActivityCardProps {
  activity: Activity;
  onClose: () => void;
  onLike: (activity: Activity, accepted: boolean) => void;
  onDislike: (activity: Activity) => void;
  similarActivities?: Activity[];
  currentIndex?: number;
  totalCount?: number;
  isReviewFlow?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onClose, 
  onLike, 
  onDislike, 
  similarActivities,
  currentIndex = 0,
  totalCount = 1,
  isReviewFlow = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const navigate = useNavigate();

  // Slide in animation on mount
  useEffect(() => {
    setIsVisible(true);
    setIsInitialLoad(false);
  }, []);

  // Handle activity changes during review flow
  useEffect(() => {
    if (isReviewFlow && !isInitialLoad) {
      // Brief slide out then slide in when activity changes
      setIsVisible(false);
      setSwipeDirection(null);
      setTimeout(() => {
        setIsVisible(true);
      }, 150);
    }
  }, [activity.id, isReviewFlow, isInitialLoad]);

  const handleClose = () => {
    setIsVisible(false);
    setSwipeDirection(null);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleReject = () => {
    // Trigger swipe left animation
    setSwipeDirection('left');
    
    // Check if this is the last activity in review flow
    if (isReviewFlow && currentIndex < totalCount - 1) {
      // More activities to review, reset after animation
      setTimeout(() => {
        setSwipeDirection(null);
        onLike(activity, false);
      }, 300);
    } else {
      // Last activity or not in review flow, close after animation
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onLike(activity, false);
          onClose();
        }, 300);
      }, 300);
    }
  };

  const handleAccept = () => {
    // Trigger swipe right animation
    setSwipeDirection('right');
    
    // Check if this is the last activity in review flow
    if (isReviewFlow && currentIndex < totalCount - 1) {
      // More activities to review, reset after animation
      setTimeout(() => {
        setSwipeDirection(null);
        onLike(activity, true);
      }, 300);
    } else {
      // Last activity or not in review flow, close after animation
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onLike(activity, true);
          onClose();
        }, 300);
      }, 300);
    }
  };

  // Get category tags from activity data
  const getCategoryTags = () => {
    const tags = [activity.category];
    
    // Add difficulty as age range
    if (activity.difficulty === 'Easy') tags.push('2-12 Ages');
    else if (activity.difficulty === 'Medium') tags.push('6-16 Ages');
    else tags.push('12+ Ages');
    
    // Add indoor/outdoor based on category
    if (activity.category.toLowerCase().includes('museum') || 
        activity.category.toLowerCase().includes('indoor')) {
      tags.push('Indoor');
    } else {
      tags.push('Outdoor');
    }
    
    tags.push('Family');
    
    return tags;
  };

  const formatPrice = () => {
    // Mock price formatting - in real app this would come from activity data
    const prices = ['Free', 'Free to £15.00', 'Free to £25.00', '£5.00 to £30.00'];
    return prices[Math.floor(Math.random() * prices.length)];
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${isVisible ? 'bg-black/30' : 'bg-black/0'}`}
        onClick={handleClose}
      />
      
      {/* Back Card Effect */}
      <div className={`absolute bottom-0 left-0 right-0 z-45 transition-all duration-300 ease-out ${
        !isVisible 
          ? 'translate-y-full' 
          : swipeDirection === 'left' 
            ? 'translate-y-2 -translate-x-2 opacity-60' 
            : swipeDirection === 'right' 
              ? 'translate-y-2 translate-x-2 opacity-60' 
              : 'translate-y-2'
      }`}>
        <div className="bg-gray-200 rounded-t-[24px] h-[70vh] mx-2 shadow-lg" />
      </div>
      
      {/* Main Drawer Container */}
      <div className={`absolute bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        !isVisible 
          ? 'translate-y-full opacity-0' 
          : swipeDirection === 'left' 
            ? '-translate-x-full translate-y-0 rotate-[-15deg] opacity-0 scale-95' 
            : swipeDirection === 'right' 
              ? 'translate-x-full translate-y-0 rotate-[15deg] opacity-0 scale-95' 
              : 'translate-y-0 opacity-100 scale-100'
      }`} style={{ zIndex: 1010 }}>
        <div className={`bg-[#fbf7ef] rounded-t-[24px] shadow-[0px_-6px_16px_0px_rgba(0,0,0,0.12)] h-[70vh] flex flex-col relative transition-all duration-300 ${
          swipeDirection === 'left' 
            ? 'border-4 border-red-400 bg-red-50/90' 
            : swipeDirection === 'right' 
              ? 'border-4 border-green-400 bg-green-50/90' 
              : ''
        }`}>
          
          {/* Activity Image */}
          <div className="relative h-[140px] bg-cover bg-center rounded-t-[24px] overflow-hidden flex-shrink-0">
            <img
              src={`https://images.unsplash.com/${activity.image}?w=400&h=240&fit=crop`}
              alt={activity.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=240&fit=crop`;
              }}
            />
            
            {/* Swipe Feedback Overlays */}
            {swipeDirection === 'left' && (
              <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                <div className="transform rotate-[-15deg] border-4 border-white rounded-lg px-6 py-3">
                  <span className="text-white text-3xl font-bold tracking-widest">NOPE</span>
                </div>
              </div>
            )}
            
            {swipeDirection === 'right' && (
              <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                <div className="transform rotate-[15deg] border-4 border-white rounded-lg px-6 py-3">
                  <span className="text-white text-3xl font-bold tracking-widest">LIKE</span>
                </div>
              </div>
            )}
          </div>

          {/* Content Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(70vh - 140px - 80px)' }}>
            
            {/* Duration Badge */}
            <div className="bg-[#ffd7b6] inline-flex items-center px-3 py-2 rounded-[34px] h-6">
              <span className="text-[#202020] text-[14px] font-medium tracking-[-0.5px]">
                ⏰ {activity.duration}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-[#222222] text-[20px] font-bold leading-tight">
              {activity.title}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#FF9845] text-[#FF9845]" />
              <span className="text-[#ff9845] text-[14px] font-normal">
                {activity.rating}
              </span>
            </div>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-3">
              {getCategoryTags().map((tag, index) => (
                <div key={index} className="bg-[#e3ddd1] px-3 py-2 rounded-[34px] h-6 flex items-center">
                  <span className="text-[#202020] text-[14px] font-medium tracking-[-0.5px] capitalize">
                    {tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5 text-[#292D32]" />
              <span className="text-[#202020] text-[14px] font-normal tracking-[-0.5px] leading-[22px]">
                {activity.location}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5 text-[#292D32]" />
              <span className="text-[#202020] text-[14px] font-normal tracking-[-0.5px] leading-[22px]">
                {formatPrice()}
              </span>
            </div>

            {/* Description */}
            <div className="bg-white p-4 rounded-2xl">
              <p className="text-[#202020] text-[14px] font-normal leading-[22px] tracking-[-0.5px]">
                {activity.description}
              </p>
              <p className="text-[#202020] text-[14px] font-semibold tracking-[-0.5px] underline mt-1">
                read more
              </p>
            </div>

            {/* Progress indicator for review flow */}
            {isReviewFlow && totalCount > 1 && (
              <div className="text-center text-sm text-gray-500 py-2">
                {currentIndex + 1} of {totalCount}
              </div>
            )}
          </div>

          {/* Bottom Buttons - Fixed at bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex gap-2 p-4 bg-[#fbf7ef] border-t border-gray-100">
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1 h-12 bg-white text-[#202020] font-bold text-[16px] uppercase tracking-[-0.75px] rounded-[34px] shadow-[0px_8px_15px_0px_rgba(165,93,35,0.35)] border-none hover:bg-gray-50"
            >
              Not today ❌
            </Button>
            
            <Button
              onClick={handleAccept}
              className="flex-1 h-12 bg-gradient-to-r from-[#FD9A55] to-[#FF6B35] text-white font-bold text-[16px] uppercase tracking-[-0.75px] rounded-[34px] shadow-[0px_8px_15px_0px_rgba(165,93,35,0.35)] border-none hover:from-[#FF6B35] hover:to-[#FF4500]"
            >
              Yes, let's go 🚀
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActivityCard;