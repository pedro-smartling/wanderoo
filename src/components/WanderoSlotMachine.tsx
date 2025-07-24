import React, { useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

    // Animate the slot machine emojis
    const intervals: NodeJS.Timeout[] = [];
    for (let i = 0; i < 8; i++) {
      const interval = setTimeout(() => {
        setSlotEmojis(getRandomEmojis());
      }, i * 200);
      intervals.push(interval);
    }

    setTimeout(() => {
      intervals.forEach(clearTimeout);
      const activities = getFilteredActivities();
      if (activities.length === 0) {
        const allActivities = Object.values(ACTIVITIES).flat();
        const newSlots = [
          allActivities[Math.floor(Math.random() * allActivities.length)],
          allActivities[Math.floor(Math.random() * allActivities.length)],
          allActivities[Math.floor(Math.random() * allActivities.length)]
        ];
        setSlots(newSlots);
      } else {
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

  // Generate random emoji icons for the slot machine
  const getRandomEmojis = () => {
    const emojis = ['🏀', '🥾', '🌲', '🍿', '🎵', '🎨', '🎭', '🏊', '🎪', '🎯', '🎲', '🎸'];
    return Array.from({ length: 12 }, () => emojis[Math.floor(Math.random() * emojis.length)]);
  };

  const [slotEmojis, setSlotEmojis] = useState(getRandomEmojis());

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF6B35] to-[#FF4500] relative overflow-hidden">
      {/* Content Container */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 text-center">
        
        {/* Header Text */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">One tap</h1>
          <h2 className="text-4xl font-bold text-white">One day sorted!</h2>
        </div>

        {/* Slot Machine Container */}
        <div className="relative mb-8">
          {/* Main slot machine card */}
          <div className="bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden w-80 h-96">
            
            {/* Top slot card */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4 relative overflow-hidden h-32">
              <div className="grid grid-cols-3 gap-2 h-full">
                {slotEmojis.slice(0, 6).map((emoji, index) => (
                  <div 
                    key={`top-${index}`}
                    className={`flex items-center justify-center text-2xl transition-transform duration-200 ${
                      spinning ? 'animate-pulse' : ''
                    }`}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom slot card */}
            <div className="bg-gray-50 rounded-2xl p-4 relative overflow-hidden h-32">
              <div className="grid grid-cols-3 gap-2 h-full">
                {slotEmojis.slice(6, 12).map((emoji, index) => (
                  <div 
                    key={`bottom-${index}`}
                    className={`flex items-center justify-center text-2xl transition-transform duration-200 ${
                      spinning ? 'animate-pulse' : ''
                    }`}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Slot machine reels overlay effect */}
            {spinning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-white/80 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-white/80 to-transparent"></div>
              </div>
            )}
          </div>

          {/* Slot machine handle/decoration */}
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-16 bg-white rounded-r-full shadow-lg"></div>
        </div>

        {/* Spin Button */}
        <Button 
          onClick={handleSpin}
          disabled={spinning}
          className="bg-gray-900 hover:bg-gray-800 text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:scale-100 mb-8"
        >
          <RotateCcw className={`mr-3 h-5 w-5 ${spinning ? 'animate-spin' : ''}`} />
          SPIN MY DAY
        </Button>

        {/* Results Section - Only show after spinning */}
        {spinCount > 0 && !spinning && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6">
            <Button 
              variant="secondary" 
              className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-2 rounded-full"
              onClick={() => onActivitySelect(slots.filter(slot => slot !== null))}
            >
              See Your Perfect Day ({slots.filter(slot => slot !== null).length} activities)
            </Button>
          </div>
        )}

        {/* Close Button */}
        <Button 
          variant="outline" 
          className="border-2 border-white text-white hover:bg-white hover:text-[#FF6B35] font-semibold px-6 py-3 rounded-full transition-all duration-200"
          onClick={() => window.history.back()}
        >
          <X className="mr-2 h-4 w-4" />
          CLOSE
        </Button>
      </div>
    </div>
  );
};

export default WanderoSlotMachine;