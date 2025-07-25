import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Calendar, Heart, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface SlotMachineProps {
  onActivitySelect: (activity: Activity) => void;
  activeFilters: string[];
  onSpin?: () => void;
}

const ACTIVITIES: Record<string, Activity[]> = {
  outdoors: [
    {
      id: '1',
      title: 'Nature Treasure Hunt',
      time: '10:00 AM',
      category: 'Outdoors',
      icon: '🌲',
      location: 'Local Park',
      duration: '1 hour',
      description: 'Find colorful leaves, smooth rocks, and pretty flowers! Perfect for little explorers.',
      image: 'photo-1472396961693-142e6e269027',
      rating: 4.8,
      difficulty: 'Easy'
    },
    {
      id: '2',
      title: 'Duck Feeding Adventure',
      time: '10:30 AM',
      category: 'Outdoors',
      icon: '🦆',
      location: 'Pond Park',
      duration: '45 minutes',
      description: 'Bring bread crumbs and feed the friendly ducks at the pond!',
      image: 'photo-1500673922987-e212871fec22',
      rating: 4.9,
      difficulty: 'Easy'
    }
  ],
  indoors: [
    {
      id: '3',
      title: 'Finger Painting Fun',
      time: '2:00 PM',
      category: 'Indoors',
      icon: '🎨',
      location: 'Art Corner',
      duration: '1 hour',
      description: 'Get messy and creative with colorful finger paints! Make your masterpiece.',
      image: 'photo-1461749280684-dccba630e2f6',
      rating: 4.7,
      difficulty: 'Easy'
    },
    {
      id: '4',
      title: 'Cartoon Movie Time',
      time: '2:00 PM',
      category: 'Indoors',
      icon: '🍿',
      location: 'Living Room',
      duration: '1.5 hours',
      description: 'Watch your favorite animated movies with yummy snacks and cozy blankets!',
      image: 'photo-1486312338219-ce68d2c6f44d',
      rating: 4.6,
      difficulty: 'Easy'
    }
  ],
  arts: [
    {
      id: '5',
      title: 'Play-Doh Creations',
      time: '11:00 AM',
      category: 'Arts',
      icon: '🧁',
      location: 'Craft Table',
      duration: '1 hour',
      description: 'Squish, roll, and shape colorful Play-Doh into amazing animals and objects!',
      image: 'photo-1523712999610-f77fbcfc3843',
      rating: 4.8,
      difficulty: 'Easy'
    },
    {
      id: '6',
      title: 'Musical Instruments Play',
      time: '3:00 PM',
      category: 'Arts',
      icon: '🎶',
      location: 'Music Corner',
      duration: '45 minutes',
      description: 'Bang drums, shake maracas, and make beautiful music with kid-friendly instruments!',
      image: 'photo-1581090464777-f3220bbe1b8b',
      rating: 4.4,
      difficulty: 'Easy'
    }
  ]
};

const SlotMachine: React.FC<SlotMachineProps> = ({ onActivitySelect, activeFilters, onSpin }) => {
  const [slots, setSlots] = useState<(Activity | null)[]>([null, null, null]);
  const [spinning, setSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);

  const getFilteredActivities = () => {
    if (activeFilters.length === 0) {
      return Object.values(ACTIVITIES).flat();
    }
    return activeFilters.flatMap(filter => ACTIVITIES[filter.toLowerCase()] || []);
  };

  const getRandomActivity = () => {
    const activities = getFilteredActivities();
    return activities[Math.floor(Math.random() * activities.length)];
  };

  const spin = () => {
    setSpinning(true);
    setSpinCount(prev => prev + 1);
    onSpin?.(); // Notify parent component

    // Simulate slot machine spinning with delays
    const spinDuration = 800;
    
    setTimeout(() => {
      const newSlots = [
        getRandomActivity(),
        getRandomActivity(),
        getRandomActivity()
      ];
      setSlots(newSlots);
      setSpinning(false);
    }, spinDuration);
  };

  const SlotTile: React.FC<{ activity: Activity | null; isSpinning: boolean; delay: number }> = 
    ({ activity, isSpinning, delay }) => (
    <div 
      className={cn(
        "relative h-32 bg-gradient-to-br from-secondary to-fun-orange rounded-2xl p-4 flex flex-col justify-center items-center shadow-lg border-4 border-white",
        isSpinning && "animate-spin-slot"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {activity ? (
        <div className="text-center">
          <div className="text-3xl mb-1">{activity.icon}</div>
          <div className="text-sm font-bold text-foreground leading-tight">
            {activity.title}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {activity.time}
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <div className="text-3xl mb-1">🎰</div>
          <div className="text-sm font-bold">Spin me!</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-primary mb-2 animate-float">
          🎰 Wanderoo Slots
        </h1>
        <p className="text-muted-foreground">
          Spin for amazing activities!
        </p>
        {spinCount > 0 && (
          <div className="mt-2">
            <Badge variant="secondary" className="animate-bounce-in">
              🌟 Spins: {spinCount} {spinCount >= 5 && "- Golden Spin Unlocked!"}
            </Badge>
          </div>
        )}
      </div>

      {/* Slot Machine */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="text-center">
          <h3 className="text-lg font-bold text-primary mb-2">Morning</h3>
          <SlotTile activity={slots[0]} isSpinning={spinning} delay={0} />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-bold text-accent mb-2">Afternoon</h3>
          <SlotTile activity={slots[1]} isSpinning={spinning} delay={200} />
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-bold text-fun-green mb-2">Wild Card</h3>
          <SlotTile activity={slots[2]} isSpinning={spinning} delay={400} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <Button
          onClick={spin}
          disabled={spinning}
          className="w-full h-14 bg-gradient-to-r from-primary to-primary-glow text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          {spinning ? (
            <>
              <RotateCcw className="mr-2 h-6 w-6 animate-spin" />
              Spinning...
            </>
          ) : (
            <>
              <Play className="mr-2 h-6 w-6" />
              Spin for Fun!
            </>
          )}
        </Button>

        {slots.some(slot => slot !== null) && (
          <div className="grid grid-cols-3 gap-2 animate-slide-up">
            {slots.map((activity, index) => (
              activity && (
                <Button
                  key={activity.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onActivitySelect(activity)}
                  className="p-3 h-auto flex flex-col items-center hover:bg-primary/10 transition-colors"
                >
                  <div className="text-xl mb-1">{activity.icon}</div>
                  <div className="text-xs text-center leading-tight">
                    Details
                  </div>
                </Button>
              )
            ))}
          </div>
        )}

        {slots.every(slot => slot !== null) && (
          <Button
            variant="outline"
            className="w-full border-orange-300 text-orange-600 hover:bg-orange-300 hover:text-white transition-colors"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Add All to Calendar
          </Button>
        )}
      </div>
    </div>
  );
};

export default SlotMachine;