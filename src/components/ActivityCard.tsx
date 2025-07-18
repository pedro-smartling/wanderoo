import React, { useState } from 'react';
import { Heart, Star, MapPin, Clock, User, X, Calendar, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  onLike: (activity: Activity) => void;
  onDislike: (activity: Activity) => void;
  similarActivities: Activity[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  onClose, 
  onLike, 
  onDislike, 
  similarActivities 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [cardTransform, setCardTransform] = useState('');

  const allActivities = [activity, ...similarActivities];
  const currentActivity = allActivities[currentIndex];

  const handleSwipe = (direction: 'like' | 'dislike') => {
    const transform = direction === 'like' ? 'translateX(100%)' : 'translateX(-100%)';
    setCardTransform(transform);
    
    setTimeout(() => {
      if (direction === 'like') {
        onLike(currentActivity);
        setIsLiked(true);
      } else {
        onDislike(currentActivity);
      }
      
      if (currentIndex < allActivities.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setCardTransform('');
      } else {
        onClose();
      }
    }, 300);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-fun-green';
      case 'Medium': return 'bg-secondary';
      case 'Hard': return 'bg-fun-red';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-slide-up">
      <div className="relative w-full max-w-sm">
        {/* Card Stack Indicator */}
        {allActivities.length > 1 && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              {currentIndex + 1} / {allActivities.length}
            </Badge>
          </div>
        )}

        <Card 
          className={cn(
            "overflow-hidden shadow-2xl transition-transform duration-300 ease-out",
            cardTransform && "transform"
          )}
          style={{ transform: cardTransform }}
        >
          {/* Activity Image */}
          <div className="relative h-64 bg-gradient-to-br from-primary/20 to-accent/20">
            <img
              src={`https://images.unsplash.com/${currentActivity.image}?w=400&h=300&fit=crop`}
              alt={currentActivity.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 left-4 bg-white/90 hover:bg-white text-foreground rounded-full h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Category & Rating */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Badge className="bg-white/90 text-foreground">
                {currentActivity.icon} {currentActivity.category}
              </Badge>
            </div>

            {/* Title & Time */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white mb-1">
                {currentActivity.title}
              </h2>
              <p className="text-white/90 text-sm">
                <Clock className="inline h-4 w-4 mr-1" />
                {currentActivity.time} • {currentActivity.duration}
              </p>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            {/* Rating & Difficulty */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="font-semibold">{currentActivity.rating}</span>
                <span className="text-muted-foreground text-sm">rating</span>
              </div>
              <Badge className={cn("text-white", getDifficultyColor(currentActivity.difficulty))}>
                {currentActivity.difficulty}
              </Badge>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{currentActivity.location}</span>
            </div>

            {/* Description */}
            <p className="text-foreground leading-relaxed">
              {currentActivity.description}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => handleSwipe('dislike')}
                className="flex-1 border-fun-red text-fun-red hover:bg-fun-red hover:text-white transition-colors"
              >
                <X className="mr-2 h-4 w-4" />
                Pass
              </Button>
              
              <Button
                onClick={() => handleSwipe('like')}
                className="flex-1 bg-gradient-to-r from-fun-green to-primary-glow text-white hover:shadow-lg transition-all"
              >
                <Heart className="mr-2 h-4 w-4" />
                Love It!
              </Button>
            </div>

            {/* Additional Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" size="sm" className="flex-1">
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Similar Activities Hint */}
            {currentIndex === 0 && similarActivities.length > 0 && (
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  Swipe to see {similarActivities.length} similar activities!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Swipe Indicators */}
        <div className="absolute inset-x-4 bottom-4 flex justify-between pointer-events-none">
          <div className="bg-fun-red/20 text-fun-red px-3 py-1 rounded-full text-sm font-semibold transform -rotate-12">
            PASS
          </div>
          <div className="bg-fun-green/20 text-fun-green px-3 py-1 rounded-full text-sm font-semibold transform rotate-12">
            LOVE IT!
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;