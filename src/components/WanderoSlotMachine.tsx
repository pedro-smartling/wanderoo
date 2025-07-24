import React, { useState } from 'react';
import { Shuffle, Heart, Calendar } from 'lucide-react';
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
  onActivitySelect: (activities: Activity[]) => void;
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
    },
    {
      id: '4',
      title: 'Hiking Adventure',
      time: '8:00 AM',
      category: 'Outdoors',
      icon: '🥾',
      location: 'Mountain Trail',
      duration: '3 hours',
      description: 'Explore scenic mountain paths and enjoy breathtaking views.',
      image: 'photo-1500673922987-e212871fec22',
      rating: 4.7,
      difficulty: 'Medium'
    },
    {
      id: '5',
      title: 'Beach Volleyball',
      time: '4:00 PM',
      category: 'Outdoors',
      icon: '🏐',
      location: 'Sandy Beach',
      duration: '1.5 hours',
      description: 'Fun beach volleyball game with friends and family.',
      image: 'photo-1472396961693-142e6e269027',
      rating: 4.5,
      difficulty: 'Medium'
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
    },
    {
      id: '6',
      title: 'Pottery Class',
      time: '11:00 AM',
      category: 'Arts',
      icon: '🏺',
      location: 'Pottery Studio',
      duration: '2 hours',
      description: 'Learn to shape clay and create beautiful ceramic pieces.',
      image: 'photo-1493397212122-2b85dda8106b',
      rating: 4.6,
      difficulty: 'Medium'
    },
    {
      id: '7',
      title: 'Music Jamming',
      time: '6:00 PM',
      category: 'Arts',
      icon: '🎵',
      location: 'Music Room',
      duration: '1 hour',
      description: 'Join others for a fun music jam session with various instruments.',
      image: 'photo-1581090464777-f3220bbe1b8b',
      rating: 4.4,
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
    },
    {
      id: '8',
      title: 'Board Game Night',
      time: '3:00 PM',
      category: 'Indoors',
      icon: '🎲',
      location: 'Living Room',
      duration: '2 hours',
      description: 'Challenge friends and family to exciting board games and puzzles.',
      image: 'photo-1605810230434-7631ac76ec81',
      rating: 4.8,
      difficulty: 'Easy'
    },
    {
      id: '9',
      title: 'Cooking Class',
      time: '1:00 PM',
      category: 'Indoors',
      icon: '👨‍🍳',
      location: 'Kitchen',
      duration: '2.5 hours',
      description: 'Learn to cook delicious meals with step-by-step guidance.',
      image: 'photo-1470813740244-df37b8c1edcb',
      rating: 4.7,
      difficulty: 'Medium'
    }
  ],
  museums: [
    {
      id: '10',
      title: 'Science Museum',
      time: '10:30 AM',
      category: 'Museums',
      icon: '🔬',
      location: 'City Science Center',
      duration: '3 hours',
      description: 'Interactive exhibits and hands-on science experiments.',
      image: 'photo-1500673922987-e212871fec22',
      rating: 4.8,
      difficulty: 'Easy'
    },
    {
      id: '11',
      title: 'Art Museum',
      time: '1:00 PM',
      category: 'Museums',
      icon: '🖼️',
      location: 'Downtown Gallery',
      duration: '2 hours',
      description: 'Explore beautiful paintings and sculptures from local artists.',
      image: 'photo-1493397212122-2b85dda8106b',
      rating: 4.5,
      difficulty: 'Easy'
    }
  ],
  sports: [
    {
      id: '12',
      title: 'Mini Golf',
      time: '5:00 PM',
      category: 'Sports',
      icon: '⛳',
      location: 'Fun Center',
      duration: '1 hour',
      description: 'Family-friendly mini golf course with challenging obstacles.',
      image: 'photo-1472396961693-142e6e269027',
      rating: 4.3,
      difficulty: 'Easy'
    },
    {
      id: '13',
      title: 'Basketball Game',
      time: '4:30 PM',
      category: 'Sports',
      icon: '🏀',
      location: 'Sports Complex',
      duration: '1.5 hours',
      description: 'Friendly basketball game for all skill levels.',
      image: 'photo-1581090464777-f3220bbe1b8b',
      rating: 4.6,
      difficulty: 'Medium'
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
      if (activities.length === 0) {
        // Fallback to all activities if no filters match
        const allActivities = Object.values(ACTIVITIES).flat();
        const newSlots = [
          allActivities[Math.floor(Math.random() * allActivities.length)],
          allActivities[Math.floor(Math.random() * allActivities.length)],
          allActivities[Math.floor(Math.random() * allActivities.length)]
        ];
        setSlots(newSlots);
      } else {
        // Ensure we get different activities for each slot
        const newSlots = [];
        for (let i = 0; i < 3; i++) {
          let randomActivity;
          let attempts = 0;
          do {
            randomActivity = activities[Math.floor(Math.random() * activities.length)];
            attempts++;
          } while (newSlots.some(slot => slot?.id === randomActivity?.id) && attempts < 10);
          
          newSlots.push(randomActivity);
        }
        setSlots(newSlots);
      }
      setSpinning(false);
    }, 1500);
  };

  const SlotCard: React.FC<{ activity: Activity; label: string; isSpinning: boolean }> = ({ 
    activity, 
    label, 
    isSpinning 
  }) => (
    <div 
      className={`bg-background border-2 rounded-2xl p-3 text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${
        isSpinning 
          ? 'animate-pulse scale-105 border-primary/50 shadow-lg' 
          : 'hover:shadow-md hover:scale-105 border-border/50 hover:border-primary/30'
      }`}
      onClick={() => !isSpinning && onActivitySelect([activity])}
    >
      {/* Slot machine reel effect */}
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent transition-opacity duration-300 ${
        isSpinning ? 'opacity-100' : 'opacity-0'
      }`}></div>
      
      <div className="relative z-10">
        <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">
          {label}
        </div>
        <div className={`text-3xl mb-2 transition-all duration-500 ${
          isSpinning ? 'animate-bounce scale-110' : 'hover:scale-110'
        }`}>
          {isSpinning ? '🎰' : activity.icon}
        </div>
        <h3 className="font-bold text-xs mb-1 line-clamp-2 min-h-[2rem]">{activity.title}</h3>
        <p className="text-xs text-muted-foreground font-medium">{activity.time}</p>
        
        {/* Difficulty badge */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
          activity.difficulty === 'Easy' ? 'bg-green-500' :
          activity.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
        }`}></div>
      </div>
    </div>
  );

  const progressValue = (spinCount % 5) * 20;

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl mx-4 p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50"></div>
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4 animate-bounce">🎰</div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Spin a Day
          </h1>
          <p className="text-muted-foreground text-lg">
            Let chance decide your perfect adventure
          </p>
        </div>
      </div>

      {/* Slot Machine Container */}
      <div className="relative bg-card border border-border/50 rounded-3xl mx-4 p-6 shadow-lg">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-6 h-6 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-8 right-8 w-4 h-4 bg-primary/30 rounded-full animate-pulse delay-300"></div>
        
        {/* Slot Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
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
            label="EVENING" 
            isSpinning={spinning}
          />
        </div>

        {/* Spin Button */}
        <Button 
          onClick={handleSpin}
          disabled={spinning}
          className="w-full h-16 bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground font-bold text-xl rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:scale-100"
        >
          <Shuffle className={`mr-3 h-6 w-6 ${spinning ? 'animate-spin' : ''}`} />
          {spinning ? 'Spinning Magic...' : 'Spin My Day'}
        </Button>

        {/* Results Section */}
        {spinCount > 0 && !spinning && (
          <div className="mt-6 p-4 bg-muted/30 rounded-2xl border">
            <div className="text-center mb-3">
              <div className="text-2xl mb-1">✨</div>
              <h3 className="font-semibold text-lg">Your Adventure Awaits!</h3>
              <p className="text-sm text-muted-foreground">Review and customize your perfect day</p>
            </div>
            <Button 
              variant="secondary" 
              className="w-full h-12 rounded-xl bg-background/80 hover:bg-background font-medium"
              onClick={() => onActivitySelect(slots.filter(slot => slot !== null))}
            >
              Review Activities ({slots.filter(slot => slot !== null).length})
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-14 rounded-2xl border-2 hover:bg-muted/50 transition-colors"
            disabled={spinCount === 0}
          >
            <Heart className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Save Combo</div>
              <div className="text-xs text-muted-foreground">Keep for later</div>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-14 rounded-2xl border-2 hover:bg-muted/50 transition-colors"
            disabled={spinCount === 0}
            onClick={() => {
              if (spinCount > 0) {
                const savedActivities = JSON.parse(localStorage.getItem('approvedActivities') || '[]');
                const newActivities = slots.map((activity, index) => ({
                  id: `combo-${activity.id}-${Date.now()}-${index}`,
                  time: activity.time,
                  title: activity.title,
                  description: activity.description,
                  completed: false,
                  color: ['yellow', 'blue', 'green'][index] as 'yellow' | 'blue' | 'green',
                  category: activity.category,
                  location: activity.location,
                  duration: activity.duration
                }));
                
                localStorage.setItem('approvedActivities', JSON.stringify([...savedActivities, ...newActivities]));
              }
            }}
          >
            <Calendar className="mr-2 h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Add to Calendar</div>
              <div className="text-xs text-muted-foreground">Schedule now</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl p-6 mx-4 border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-lg">⭐</span>
            </div>
            <h3 className="font-bold text-lg">Golden Spin</h3>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            {spinCount % 5}/5 spins
          </Badge>
        </div>
        <Progress value={progressValue} className="mb-3 h-2" />
        <p className="text-sm text-muted-foreground text-center">
          {5 - (spinCount % 5) === 0 
            ? "🎉 Golden Spin Ready! Unlock premium activities!" 
            : `${5 - (spinCount % 5)} more spins until your golden reward`
          }
        </p>
      </div>

      {/* Metadata */}
      <div className="flex justify-center items-center gap-6 px-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Within 30 min</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Group size: 4</span>
        </div>
      </div>
    </div>
  );
};

export default WanderoSlotMachine;