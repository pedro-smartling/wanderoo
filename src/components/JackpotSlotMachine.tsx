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

interface JackpotSlotMachineProps {
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

const JackpotSlotMachine: React.FC<JackpotSlotMachineProps> = ({ onActivitySelect, activeFilters, onSpin }) => {
  const [slots, setSlots] = useState<(Activity | null)[]>([null, null, null]);
  const [spinning, setSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [coins, setCoins] = useState(200);
  const [turnsLeft, setTurnsLeft] = useState(10);

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
    if (turnsLeft <= 0 || coins < 10) return;
    
    setSpinning(true);
    setSpinCount(prev => prev + 1);
    setCoins(prev => prev - 10);
    setTurnsLeft(prev => prev - 1);
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
      
      // Bonus coins for good combinations
      if (newSlots.every(slot => slot?.category === newSlots[0]?.category)) {
        setCoins(prev => prev + 50);
      }
    }, spinDuration);
  };

  const SlotSymbol: React.FC<{ activity: Activity | null; isSpinning: boolean; delay: number }> = 
    ({ activity, isSpinning, delay }) => (
    <div 
      className={cn(
        "relative w-16 h-16 bg-gradient-to-br from-card to-muted rounded-lg flex items-center justify-center border-2 border-border shadow-inner",
        isSpinning && "animate-spin-slot"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {activity ? (
        <div className="text-2xl">{activity.icon}</div>
      ) : (
        <div className="text-2xl text-muted-foreground">❓</div>
      )}
    </div>
  );

  // Background grid pattern
  const GridBackground = () => (
    <div className="absolute inset-0 opacity-20">
      <div className="grid grid-cols-8 grid-rows-12 h-full">
        {Array.from({ length: 96 }, (_, i) => (
          <div key={i} className="border border-primary/20"></div>
        ))}
      </div>
    </div>
  );

  // Floating sparkles
  const Sparkles = () => (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-secondary rounded-full animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="relative max-w-md mx-auto">
      <GridBackground />
      <Sparkles />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-jackpot-green to-primary mb-2">
            🎰 Frolic Jumbo
          </h1>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary-glow">
            JACKPOT
          </h2>
          
          {/* Stats */}
          <div className="flex justify-between items-center mt-4 px-4">
            <Badge variant="outline" className="border-secondary text-secondary">
              <Coins className="w-4 h-4 mr-1 animate-coin-flip" />
              {coins}
            </Badge>
            <Badge variant="outline" className="border-primary text-primary">
              {turnsLeft} of 10 turns left
            </Badge>
          </div>
        </div>

        {/* Slot Machine */}
        <div className="relative bg-gradient-to-br from-jackpot-green via-primary to-accent rounded-3xl p-6 mb-6 shadow-2xl animate-glow-pulse">
          {/* Top border lights */}
          <div className="absolute top-2 left-6 right-6 flex justify-between">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="w-3 h-3 bg-secondary rounded-full animate-sparkle" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          
          {/* Slot Display */}
          <div className="bg-gradient-to-br from-background to-card rounded-2xl p-6 shadow-inner border-4 border-jackpot-green-glow">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <SlotSymbol activity={slots[0]} isSpinning={spinning} delay={0} />
              <SlotSymbol activity={slots[1]} isSpinning={spinning} delay={200} />
              <SlotSymbol activity={slots[2]} isSpinning={spinning} delay={400} />
            </div>
            
            {/* Center Display */}
            <div className="text-center">
              {slots.every(slot => slot !== null) ? (
                <div className="text-3xl font-bold text-jackpot-green animate-bounce-in">
                  7
                </div>
              ) : (
                <div className="text-2xl text-muted-foreground">
                  ???
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom border lights */}
          <div className="absolute bottom-2 left-6 right-6 flex justify-between">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="w-3 h-3 bg-secondary rounded-full animate-sparkle" style={{ animationDelay: `${i * 0.2 + 1}s` }} />
            ))}
          </div>
        </div>

        {/* Slide to Start */}
        <div className="relative">
          <Button
            onClick={spin}
            disabled={spinning || turnsLeft <= 0 || coins < 10}
            className="w-full h-16 bg-gradient-to-r from-jackpot-green to-jackpot-green-glow text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {spinning ? (
              <>
                <RotateCcw className="mr-2 h-6 w-6 animate-spin" />
                Spinning...
              </>
            ) : turnsLeft <= 0 ? (
              "No Turns Left"
            ) : coins < 10 ? (
              "Need More Coins"
            ) : (
              "Slide to start"
            )}
          </Button>
          
          {/* Coin indicator */}
          <div className="absolute -right-2 -top-2 bg-secondary text-background px-2 py-1 rounded-full text-sm font-bold animate-coin-flip">
            💰 {coins}
          </div>
        </div>

        {/* Activity Results */}
        {slots.some(slot => slot !== null) && (
          <div className="mt-6 space-y-3 animate-slide-up">
            {slots.map((activity, index) => (
              activity && (
                <div
                  key={activity.id}
                  className="bg-card rounded-xl p-4 border border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => onActivitySelect(activity)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {['Morning', 'Afternoon', 'Wild Card'][index]}
                    </Badge>
                  </div>
                </div>
              )
            ))}
            
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
        )}
      </div>
    </div>
  );
};

export default JackpotSlotMachine;