import React, { useState, useEffect } from 'react';
import { Star, Gift, Trophy, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RewardSystemProps {
  spinCount: number;
  likedActivities: number;
}

const RewardSystem: React.FC<RewardSystemProps> = ({ spinCount, likedActivities }) => {
  const [showReward, setShowReward] = useState(false);
  const [rewardType, setRewardType] = useState<'golden-spin' | 'streak' | 'explorer'>('golden-spin');

  useEffect(() => {
    if (spinCount > 0 && spinCount % 5 === 0) {
      setRewardType('golden-spin');
      setShowReward(true);
    } else if (likedActivities > 0 && likedActivities % 3 === 0) {
      setRewardType('streak');
      setShowReward(true);
    }
  }, [spinCount, likedActivities]);

  const getRewardContent = () => {
    switch (rewardType) {
      case 'golden-spin':
        return {
          icon: '🏆',
          title: 'Golden Spin Unlocked!',
          description: 'You\'ve earned a special premium activity!',
          buttonText: 'Claim Golden Spin',
          gradient: 'from-secondary to-fun-orange'
        };
      case 'streak':
        return {
          icon: '🔥',
          title: 'Activity Streak!',
          description: 'You\'re on fire! Here\'s a bonus surprise.',
          buttonText: 'Claim Bonus',
          gradient: 'from-fun-red to-fun-pink'
        };
      case 'explorer':
        return {
          icon: '🗺️',
          title: 'Explorer Badge!',
          description: 'You\'ve discovered so many activities!',
          buttonText: 'View Badge',
          gradient: 'from-accent to-primary'
        };
    }
  };

  const getProgressToNextReward = () => {
    const nextGoldenSpin = Math.ceil(spinCount / 5) * 5;
    const spinsUntilReward = nextGoldenSpin - spinCount;
    return spinsUntilReward > 0 ? spinsUntilReward : 5;
  };

  if (showReward) {
    const reward = getRewardContent();
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-sm animate-bounce-in">
          <CardContent className="p-6 text-center">
            <div className={cn(
              "w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl bg-gradient-to-br",
              reward.gradient
            )}>
              {reward.icon}
            </div>
            
            <h3 className="text-2xl font-bold text-primary mb-2">
              {reward.title}
            </h3>
            
            <p className="text-muted-foreground mb-6">
              {reward.description}
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary-glow text-white"
                onClick={() => setShowReward(false)}
              >
                <Gift className="mr-2 h-4 w-4" />
                {reward.buttonText}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowReward(false)}
              >
                Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-primary flex items-center gap-2">
          <Star className="h-5 w-5" />
          Rewards
        </h3>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i < (spinCount % 5) ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {getProgressToNextReward()} spins to Golden Spin
          </span>
          <Badge variant="secondary" className="text-xs">
            <Trophy className="h-3 w-3 mr-1" />
            Level {Math.floor(spinCount / 5) + 1}
          </Badge>
        </div>
        
        {likedActivities > 0 && (
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              {likedActivities} activities loved
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardSystem;