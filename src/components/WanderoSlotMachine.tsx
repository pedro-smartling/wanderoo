import React, { useState } from 'react';
import { Dice1, Heart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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

interface WanderoSlotMachineProps {
  activeFilters: string[];
  onSpin: () => void;
  onActivitySelect: (activity: Activity) => void;
  spinCount: number;
}

const ACTIVITIES: Record<string, Activity[]> = {
  outdoors: [
    {
      id: '1',
      title: 'Nature Scavenger Hunt',
      time: '10:00 AM',
      category: 'Outdoors',
      icon: '🌲',
      location: 'Local Park',
      duration: '2 hours',
      description: 'Find hidden treasures in nature! Look for pinecones, colorful leaves, and cool rocks.',
      image: 'photo-1472396961693-142e6e269027',
      rating: 4.8,
      difficulty: 'Easy'
    }
  ],
  arts: [
    {
      id: '2',
      title: 'Art Workshop',
      time: '2:00 PM',
      category: 'Arts',
      icon: '🎨',
      location: 'Art Studio',
      duration: '1.5 hours',
      description: 'Express your creativity with colors, brushes, and imagination!',
      image: 'photo-1523712999610-f77fbcfc3843',
      rating: 4.9,
      difficulty: 'Easy'
    }
  ],
  indoors: [
    {
      id: '3',
      title: 'Movie Night',
      time: '7:00 PM',
      category: 'Indoors',
      icon: '⭐',
      location: 'Home Theater',
      duration: '2.5 hours',
      description: 'Cozy up with a family-friendly movie and delicious homemade popcorn.',
      image: 'photo-1486312338219-ce68d2c6f44d',
      rating: 4.6,
      difficulty: 'Easy'
    }
  ]
};

const WanderoSlotMachine: React.FC<WanderoSlotMachineProps> = ({ 
  activeFilters, 
  onSpin, 
  onActivitySelect,
  spinCount 
}) => {
  const [slots, setSlots] = useState<Activity[]>([
    ACTIVITIES.outdoors[0],
    ACTIVITIES.arts[0], 
    ACTIVITIES.indoors[0]
  ]);
  const [spinning, setSpinning] = useState(false);

  const getFilteredActivities = () => {
    if (activeFilters.length === 0) {
      return Object.values(ACTIVITIES).flat();
    }
    return activeFilters.flatMap(filter => ACTIVITIES[filter.toLowerCase()] || []);
  };

  const handleSpin = () => {
    if (spinning) return;
    
    setSpinning(true);
    onSpin();

    setTimeout(() => {
      const activities = getFilteredActivities();
      const newSlots = [
        activities[Math.floor(Math.random() * activities.length)] || ACTIVITIES.outdoors[0],
        activities[Math.floor(Math.random() * activities.length)] || ACTIVITIES.arts[0],
        activities[Math.floor(Math.random() * activities.length)] || ACTIVITIES.indoors[0]
      ];
      setSlots(newSlots);
      setSpinning(false);
    }, 1500);
  };

  const SlotCard: React.FC<{ activity: Activity; label: string; isSpinning: boolean }> = ({ 
    activity, 
    label, 
    isSpinning 
  }) => (
    <div 
      className={`bg-card border rounded-2xl p-4 text-center transition-transform duration-300 cursor-pointer hover:shadow-md ${
        isSpinning ? 'animate-pulse scale-105' : ''
      }`}
      onClick={() => !isSpinning && onActivitySelect(activity)}
    >
      <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
        {label}
      </div>
      <div className={`text-4xl mb-2 transition-transform duration-500 ${
        isSpinning ? 'animate-spin' : ''
      }`}>
        {isSpinning ? '🎰' : activity.icon}
      </div>
      <h3 className="font-semibold text-sm mb-1">{activity.title}</h3>
      <p className="text-xs text-muted-foreground">{activity.time}</p>
    </div>
  );

  const progressValue = (spinCount % 5) * 20;

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Wanderoo Slot Machine</h2>
        <p className="text-muted-foreground">
          Spin to discover amazing activities for your family
        </p>
      </div>

      {/* Additional Filters */}
      <div className="flex justify-between px-4 text-sm text-muted-foreground">
        <span>Within 30 min drive</span>
        <span>Group size: 4</span>
      </div>

      {/* Slot Cards */}
      <div className="grid grid-cols-3 gap-3 px-4">
        <SlotCard 
          activity={slots[0]} 
          label="MORNING" 
          isSpinning={spinning}
        />
        <SlotCard 
          activity={slots[1]} 
          label="AFTERNOON" 
          isSpinning={spinning}
        />
        <SlotCard 
          activity={slots[2]} 
          label="WILD CARD" 
          isSpinning={spinning}
        />
      </div>

      {/* Spin Button */}
      <div className="px-4">
        <Button 
          onClick={handleSpin}
          disabled={spinning}
          className="w-full h-14 bg-primary text-primary-foreground font-semibold text-lg rounded-2xl disabled:opacity-70"
        >
          <Dice1 className={`mr-2 h-5 w-5 ${spinning ? 'animate-spin' : ''}`} />
          {spinning ? 'Spinning...' : 'Spin My Day'}
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 px-4">
        <Button variant="outline" className="h-12 rounded-2xl">
          <Heart className="mr-2 h-4 w-4" />
          Save Combo
        </Button>
        <Button variant="outline" className="h-12 rounded-2xl">
          <Calendar className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
      </div>

      {/* Progress Section */}
      <div className="bg-muted/50 rounded-2xl p-4 mx-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Golden Spin Progress</h3>
          <span className="text-sm text-muted-foreground">{spinCount % 5}/5 spins</span>
        </div>
        <Progress value={progressValue} className="mb-2" />
        <p className="text-sm text-muted-foreground">
          {5 - (spinCount % 5)} more spins to unlock premium activities!
        </p>
      </div>
    </div>
  );
};

export default WanderoSlotMachine;