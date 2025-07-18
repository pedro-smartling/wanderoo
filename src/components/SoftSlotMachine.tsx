import React, { useState } from 'react';
import { RotateCcw, Calendar, Coins } from 'lucide-react';
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

interface SoftSlotMachineProps {
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

const SoftSlotMachine: React.FC<SoftSlotMachineProps> = ({ onActivitySelect, activeFilters, onSpin }) => {
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
    onSpin?.();

    const spinDuration = 1200;
    
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

  const SlotSymbol: React.FC<{ activity: Activity | null; isSpinning: boolean; delay: number }> = 
    ({ activity, isSpinning, delay }) => (
    <div 
      className={cn(
        "relative w-20 h-20 bg-white/90 rounded-3xl flex items-center justify-center border-2 border-soft-coral/20 shadow-soft backdrop-blur-sm",
        isSpinning && "animate-spin"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {activity ? (
        <div className="text-3xl">{activity.icon}</div>
      ) : (
        <div className="text-3xl text-soft-coral/60">❓</div>
      )}
    </div>
  );

  return (
    <div className="relative max-w-md mx-auto">
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-soft-coral mb-2">
            🎰 Activity Spinner
          </h1>
          <p className="text-soft-coral/80 text-sm">Spin to discover your next adventure!</p>
        </div>

        {/* Slot Machine */}
        <div className="relative bg-gradient-to-br from-soft-coral/20 to-soft-peach/20 rounded-3xl p-6 mb-6 shadow-soft backdrop-blur-sm border border-white/30">
          {/* Slot Display */}
          <div className="bg-white/80 rounded-2xl p-6 shadow-soft border border-soft-coral/10 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <SlotSymbol activity={slots[0]} isSpinning={spinning} delay={0} />
              <SlotSymbol activity={slots[1]} isSpinning={spinning} delay={200} />
              <SlotSymbol activity={slots[2]} isSpinning={spinning} delay={400} />
            </div>
            
            {/* Center Display */}
            <div className="text-center">
              {slots.every(slot => slot !== null) ? (
                <div className="text-2xl font-bold text-soft-coral">
                  ✨ Perfect Match! ✨
                </div>
              ) : (
                <div className="text-lg text-soft-coral/60">
                  Spin to discover!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <div className="relative">
          <Button
            onClick={spin}
            disabled={spinning}
            className="w-full h-16 bg-gradient-to-r from-soft-coral to-soft-peach text-white font-bold text-lg rounded-3xl shadow-soft hover:shadow-lg transition-all duration-300 disabled:opacity-50 border-0"
          >
            {spinning ? (
              <>
                <RotateCcw className="mr-2 h-6 w-6 animate-spin" />
                Spinning...
              </>
            ) : (
              "🎰 Spin for Activities!"
            )}
          </Button>
        </div>

        {/* Activity Results */}
        {slots.some(slot => slot !== null) && (
          <div className="mt-6 space-y-3">
            {slots.map((activity, index) => (
              activity && (
                <div
                  key={activity.id}
                  className="bg-white/90 rounded-2xl p-4 border border-soft-coral/10 hover:border-soft-coral/30 transition-colors cursor-pointer shadow-soft backdrop-blur-sm"
                  onClick={() => onActivitySelect(activity)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-soft-coral">{activity.title}</h4>
                      <p className="text-sm text-soft-coral/70">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-soft-coral/20 text-soft-coral/80">
                      {activity.category}
                    </Badge>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftSlotMachine;