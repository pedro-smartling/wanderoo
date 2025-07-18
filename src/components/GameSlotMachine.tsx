import React, { useState } from 'react';
import { RotateCcw, Calendar, Star, Lock, CheckCircle, Play } from 'lucide-react';
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

interface GameSlotMachineProps {
  onActivitySelect: (activity: Activity) => void;
  activeFilters: string[];
  onSpin?: () => void;
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
    },
    {
      id: '2',
      title: 'Playground Adventure',
      time: '11:00 AM',
      category: 'Outdoors',
      icon: '🏃‍♂️',
      location: 'Adventure Playground',
      duration: '1.5 hours',
      description: 'Swing, slide, and climb your way to fun! Perfect for burning energy.',
      image: 'photo-1500673922987-e212871fec22',
      rating: 4.9,
      difficulty: 'Easy'
    }
  ],
  indoors: [
    {
      id: '3',
      title: 'Coding Workshop',
      time: '2:00 PM',
      category: 'Indoors',
      icon: '💻',
      location: 'Tech Center',
      duration: '2 hours',
      description: 'Learn to code with fun games and colorful blocks. Create your first app!',
      image: 'photo-1461749280684-dccba630e2f6',
      rating: 4.7,
      difficulty: 'Medium'
    },
    {
      id: '4',
      title: 'Movie & Popcorn Time',
      time: '3:00 PM',
      category: 'Indoors',
      icon: '🎬',
      location: 'Home Theater',
      duration: '2.5 hours',
      description: 'Cozy up with a family-friendly movie and delicious homemade popcorn.',
      image: 'photo-1486312338219-ce68d2c6f44d',
      rating: 4.6,
      difficulty: 'Easy'
    }
  ],
  arts: [
    {
      id: '5',
      title: 'Paint & Create Studio',
      time: '1:00 PM',
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
  museums: [
    {
      id: '6',
      title: 'Interactive Science Museum',
      time: '10:30 AM',
      category: 'Museums',
      icon: '🔬',
      location: 'City Science Museum',
      duration: '3 hours',
      description: 'Touch, explore, and discover amazing science experiments and exhibits.',
      image: 'photo-1500673922987-e212871fec22',
      rating: 4.8,
      difficulty: 'Medium'
    }
  ],
  sports: [
    {
      id: '7',
      title: 'Mini Soccer League',
      time: '4:00 PM',
      category: 'Sports',
      icon: '⚽',
      location: 'Sports Complex',
      duration: '1 hour',
      description: 'Join a fun soccer game with kids your age. Teamwork and goals await!',
      image: 'photo-1472396961693-142e6e269027',
      rating: 4.7,
      difficulty: 'Medium'
    }
  ]
};

const GameSlotMachine: React.FC<GameSlotMachineProps> = ({ onActivitySelect, activeFilters, onSpin }) => {
  const [slots, setSlots] = useState<(Activity | null)[]>([null, null, null]);
  const [spinning, setSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [unlockedActivities, setUnlockedActivities] = useState(1);

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
    setUnlockedActivities(prev => Math.min(prev + 1, 6));
    onSpin?.();

    const spinDuration = 1000;
    
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

  // Journey Map Component
  const JourneyMap = () => (
    <div className="relative bg-gradient-to-b from-game-green-light to-accent rounded-3xl p-6 mb-6">
      {/* Path with activity nodes */}
      <div className="relative">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 400" preserveAspectRatio="none">
          <path 
            d="M 50 50 Q 150 100 250 150 Q 150 200 50 250 Q 150 300 250 350" 
            stroke="white" 
            strokeWidth="4" 
            fill="none" 
            strokeDasharray="8,4"
            className="opacity-60"
          />
        </svg>
        
        {/* Activity Nodes */}
        <div className="relative z-10 grid grid-cols-3 gap-4 h-80">
          {Array.from({ length: 6 }, (_, i) => {
            const isUnlocked = i < unlockedActivities;
            const isCompleted = i < spinCount;
            const isCurrent = i === unlockedActivities - 1;
            
            return (
              <div
                key={i}
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border-4",
                  isCompleted 
                    ? "bg-game-yellow border-white text-white animate-bounce-in" 
                    : isUnlocked
                    ? "bg-white border-game-green text-game-green hover:scale-110 cursor-pointer"
                    : "bg-gray-400 border-gray-300 text-gray-600",
                  isCurrent && "ring-4 ring-white ring-opacity-60 animate-pulse"
                )}
                style={{
                  gridColumn: (i % 2) + 1,
                  gridRow: Math.floor(i / 2) + 1,
                  justifySelf: i % 2 === 0 ? 'start' : 'end',
                  alignSelf: 'center',
                  transform: `translateY(${i * 20}px)`
                }}
                onClick={() => isUnlocked && spin()}
              >
                {isCompleted ? (
                  <CheckCircle className="h-8 w-8" />
                ) : isUnlocked ? (
                  <Play className="h-6 w-6" />
                ) : (
                  <Lock className="h-6 w-6" />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 left-8 text-2xl animate-wiggle">🌳</div>
        <div className="absolute top-16 right-12 text-xl animate-float">🌸</div>
        <div className="absolute bottom-20 left-16 text-lg animate-bounce">🦋</div>
        <div className="absolute bottom-8 right-8 text-2xl animate-wiggle">🏠</div>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4 text-center">
        <Badge className="bg-white/90 text-game-green">
          <Star className="h-3 w-3 mr-1" />
          Level {Math.floor(spinCount / 2) + 1} • {unlockedActivities}/6 Activities
        </Badge>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Journey Map */}
      <JourneyMap />

      {/* Current Activity Display */}
      {slots.some(slot => slot !== null) && (
        <div className="bg-white rounded-3xl p-6 shadow-card">
          <h3 className="text-lg font-bold text-game-green mb-4 text-center">
            🎉 New Activities Unlocked!
          </h3>
          
          <div className="space-y-3">
            {slots.map((activity, index) => (
              activity && (
                <div
                  key={activity.id}
                  className="bg-gradient-to-r from-game-green-light to-accent rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer hover:scale-102"
                  onClick={() => onActivitySelect(activity)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{activity.title}</h4>
                      <p className="text-white/80 text-sm">{activity.time} • {activity.duration}</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-white/20 text-white text-xs">
                        {['Morning', 'Afternoon', 'Wild Card'][index]}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            ))}
            
            <Button
              className="w-full bg-game-orange hover:bg-game-orange/90 text-white font-bold py-3 rounded-2xl shadow-lg"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Add All to Calendar
            </Button>
          </div>
        </div>
      )}

      {/* Spin Button */}
      <div className="text-center">
        <Button
          onClick={spin}
          disabled={spinning || unlockedActivities >= 6}
          className={cn(
            "w-full h-16 font-bold text-lg rounded-3xl shadow-lg transition-all duration-300",
            spinning 
              ? "bg-gray-400 text-gray-600" 
              : unlockedActivities >= 6
              ? "bg-game-yellow text-white"
              : "bg-game-orange hover:bg-game-orange/90 text-white hover:scale-105"
          )}
        >
          {spinning ? (
            <>
              <RotateCcw className="mr-2 h-6 w-6 animate-spin" />
              Discovering Adventures...
            </>
          ) : unlockedActivities >= 6 ? (
            "🏆 All Activities Unlocked!"
          ) : (
            <>
              <Play className="mr-2 h-6 w-6" />
              Continue Journey
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GameSlotMachine;