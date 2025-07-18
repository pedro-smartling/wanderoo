import React, { useState } from 'react';
import { Heart, Star, MapPin, Clock, ArrowLeft, Share2, X, Check, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
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
  similarActivities: Activity[];
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
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleLike = () => {
    setIsLiked(true);
    if (!isReviewFlow) {
      onLike(activity, true);
    }
  };

  const handleReject = () => {
    if (isReviewFlow) {
      onLike(activity, false);
    } else {
      onDislike(activity);
      onClose();
    }
  };

  const addToCalendar = (activity: Activity) => {
    const savedActivities = JSON.parse(localStorage.getItem('approvedActivities') || '[]');
    
    const calendarActivity = {
      id: `approved-${activity.id}-${Date.now()}`,
      time: activity.time,
      title: activity.title,
      description: activity.description,
      completed: false,
      color: 'blue' as const,
      category: activity.category,
      location: activity.location,
      duration: activity.duration
    };

    const updatedActivities = [...savedActivities, calendarActivity];
    localStorage.setItem('approvedActivities', JSON.stringify(updatedActivities));
  };

  const handleAccept = () => {
    if (isReviewFlow) {
      onLike(activity, true);
    } else {
      handleLike();
      addToCalendar(activity);
      // Navigate to calendar page when activity is accepted
      navigate('/calendar');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background w-full max-w-md h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            {isReviewFlow && (
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {totalCount}
              </span>
            )}
            <h1 className="font-semibold">Activity Details</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              "p-2",
              isLiked && "text-red-500"
            )}
          >
            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
          </Button>
        </div>

        {/* Activity Image */}
        <div className="relative h-48 bg-muted">
          <img
            src={`https://images.unsplash.com/${activity.image}?w=400&h=300&fit=crop`}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-white text-xl font-bold">{activity.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Title & Duration */}
          <div>
            <h2 className="text-xl font-bold mb-1">{activity.title}</h2>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{activity.duration}</span>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Central Park, 59th St & 5th Ave, New York, NY 10019
            </p>
            <Button variant="link" className="p-0 h-auto text-primary">
              <MapPin className="h-4 w-4 mr-1" />
              View on Maps
            </Button>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {activity.description}
            </p>
          </div>

          {/* Open Times */}
          <div>
            <h3 className="font-semibold mb-2">Open Times</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Daily:</span> 9:00 AM - 5:00 PM</p>
              <p><span className="font-medium">Weekends:</span> 8:00 AM - 6:00 PM</p>
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              You visited here in November 2024
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{activity.category}</Badge>
              <Badge variant="secondary">Nature</Badge>
              <Badge variant="secondary">Active</Badge>
              <Badge variant="secondary">Family</Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleReject}
              className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            
            <Button
              onClick={handleAccept}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Check className="mr-2 h-4 w-4" />
              {isReviewFlow ? 'Accept' : 'Accept'}
            </Button>
          </div>

          {/* Similar Activities */}
          {similarActivities.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Similar Activities</h3>
              <div className="space-y-3">
                {similarActivities.slice(0, 2).map((similar) => (
                  <Card key={similar.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="relative w-20 h-16 bg-muted flex-shrink-0">
                        <img
                          src={`https://images.unsplash.com/${similar.image}?w=100&h=80&fit=crop`}
                          alt={similar.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-1 left-1 text-white text-xs font-medium">
                          {similar.title}
                        </div>
                      </div>
                      <div className="p-3 flex-1">
                        <h4 className="font-medium text-sm mb-1">{similar.title}</h4>
                        <p className="text-xs text-muted-foreground">{similar.duration} • 3 hours away</p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">{similar.category}</Badge>
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;