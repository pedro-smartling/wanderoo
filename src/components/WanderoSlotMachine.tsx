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
      className={`bg-card border rounded-2xl p-4 text-center transition-transform duration-300 cursor-pointer hover:shadow-md ${
        isSpinning ? 'animate-pulse scale-105' : ''
      }`}
      onClick={() => !isSpinning && onActivitySelect([activity])}
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
          <Shuffle className={`mr-2 h-5 w-5 ${spinning ? 'animate-spin' : ''}`} />
          {spinning ? 'Spinning...' : 'Spin My Day'}
        </Button>
      </div>

      {/* See Details Button - Only show after spinning */}
      {spinCount > 0 && (
        <div className="px-4">
          <Button 
            variant="secondary" 
            className="w-full h-12 rounded-2xl"
            onClick={() => onActivitySelect(slots.filter(slot => slot !== null))}
          >
            Review All Activities ({slots.filter(slot => slot !== null).length})
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 px-4">
        <Button variant="outline" className="h-12 rounded-2xl">
          <Heart className="mr-2 h-4 w-4" />
          Save Combo
        </Button>
        <Button 
          variant="outline" 
          className="h-12 rounded-2xl"
          onClick={() => {
            // Add all current slot activities to calendar
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
          }}
        >
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