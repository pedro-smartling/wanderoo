import React, { useState } from 'react';
import { RotateCcw, Calendar, Heart, Star } from 'lucide-react';
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

  const SlotTile: React.FC<{ activity: Activity | null; isSpinning: boolean; delay: number; label: string }> = 
    ({ activity, isSpinning, delay, label }) => (
    <div className="text-center space-y-3">
      <h3 className="text-sm font-bold text-foreground opacity-70">{label}</h3>
      <div 
        className={cn(
          "relative h-24 w-full bg-gradient-to-br from-white to-soft-pink rounded-3xl p-4 flex flex-col justify-center items-center shadow-card border border-soft-pink/30 transition-all duration-300",
          isSpinning && "animate-spin-slot",
          activity && "hover:shadow-lg hover:scale-105"
        )}
        style={{ animationDelay: `${delay}ms` }}
      >
        {activity ? (
          <div className="text-center">
            <div className="text-3xl mb-1">{activity.icon}</div>
            <div className="text-xs font-semibold text-foreground leading-tight">
              {activity.title.split(' ').slice(0, 2).join(' ')}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <div className="text-3xl mb-1">✨</div>
            <div className="text-xs font-semibold">Ready!</div>
          </div>
        )}
      </div>
    </div>
  );

  // Organic background blobs
  const OrganicBlobs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-10 -left-20 w-40 h-40 bg-gradient-to-br from-soft-orange/30 to-soft-coral/30 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 -right-10 w-32 h-32 bg-gradient-to-br from-soft-pink/40 to-secondary/30 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );

  return (
    <div className="relative max-w-md mx-auto">
      <OrganicBlobs />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-accent to-primary text-white px-6 py-3 rounded-full mb-4 shadow-soft">
            <h1 className="text-xl font-black">
              🎰 Adventure Spinner
            </h1>
          </div>
          
          <p className="text-muted-foreground text-sm">
            Discover your perfect day activities!
          </p>
          
          {spinCount > 0 && (
            <div className="mt-3">
              <Badge className="bg-soft-coral text-white animate-bounce-in">
                <Star className="w-3 h-3 mr-1" />
                {spinCount} spins {spinCount >= 5 && "• Bonus unlocked!"}
              </Badge>
            </div>
          )}
        </div>

        {/* Main Slot Card */}
        <div className="bg-gradient-to-br from-white via-white to-soft-pink/20 rounded-3xl p-6 mb-6 shadow-soft border border-soft-pink/20">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <SlotTile activity={slots[0]} isSpinning={spinning} delay={0} label="Morning" />
            <SlotTile activity={slots[1]} isSpinning={spinning} delay={200} label="Afternoon" />
            <SlotTile activity={slots[2]} isSpinning={spinning} delay={400} label="Wild Card" />
          </div>

          {/* Spin Button */}
          <Button
            onClick={spin}
            disabled={spinning}
            className="w-full h-14 bg-gradient-to-r from-accent via-primary to-secondary text-white font-bold text-lg rounded-3xl shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
          >
            {spinning ? (
              <>
                <RotateCcw className="mr-2 h-5 w-5 animate-spin" />
                Creating magic...
              </>
            ) : (
              <>
                <Heart className="mr-2 h-5 w-5" />
                Spin for Adventures!
              </>
            )}
          </Button>
        </div>

        {/* Activity Results */}
        {slots.some(slot => slot !== null) && (
          <div className="space-y-3 animate-slide-up">
            {slots.map((activity, index) => (
              activity && (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl p-4 shadow-card border border-soft-pink/20 hover:border-primary/30 transition-all cursor-pointer hover:scale-102 hover:shadow-lg"
                  onClick={() => onActivitySelect(activity)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.time} • {activity.duration}</p>
                      <p className="text-xs text-muted-foreground">{activity.location}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                        {['Morning', 'Afternoon', 'Wild Card'][index]}
                      </Badge>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-secondary text-secondary" />
                        <span className="text-xs font-semibold">{activity.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))}
            
            {slots.every(slot => slot !== null) && (
              <Button
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors rounded-2xl py-3"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Add All to My Calendar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftSlotMachine;