import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Confetti from 'react-confetti';
import { Activity } from '@/hooks/useActivities';

interface WanderoSlotMachineProps {
  activities: Activity[];
  activeFilters: string[];
  onSpin: () => void;
  onActivitySelect: (activities: Activity[]) => void;
  onClose: () => void;
  spinCount: number;
}

// Slot machine emoji patterns based on Figma design
const SLOT_EMOJIS = ['🦆', '🏖️', '🌲', '🛝', '🍿', '🎶'];

// Component for individual slot reel with vertical animation
const SlotReel: React.FC<{
  finalEmoji: string;
  spinning: boolean;
  delay: number;
  opacity: number;
  zIndex?: number;
}> = ({ finalEmoji, spinning, delay, opacity, zIndex }) => {
  const [reelPosition, setReelPosition] = useState(0);

  // Create a stable list of emojis for the reel effect that only changes when finalEmoji changes
  const reelEmojis = useMemo(() => {
    const emojis = Array.from({ length: 20 }, (_, i) =>
      SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)]
    );
    // Add the final emoji at a specific position
    emojis[15] = finalEmoji;
    return emojis;
  }, [finalEmoji]);

  useEffect(() => {
    if (spinning) {
      const interval = setInterval(() => {
        setReelPosition(prev => (prev + 1) % 10);
      }, 100 + delay);

      return () => clearInterval(interval);
    }
  }, [spinning, delay]);

  return (
    <div className="relative w-[74px] h-[37px] overflow-hidden" style={{ zIndex: zIndex || 100 }}>
      {/* Visible window - shows only the middle emoji */}
      <div
        className={`
          flex flex-col transition-transform duration-100 ease-linear
          ${spinning ? 'animate-slot-reel-spin' : ''}
        `}
        style={{
          transform: spinning
            ? `translateY(-${(reelPosition * 37)}px)`
            : 'translateY(-555px)', // Position to show final emoji in middle (15 * 37px)
          opacity: opacity
        }}
      >
        {reelEmojis.map((emoji, index) => (
          <div
            key={index}
            className="font-['Reddit_Sans'] font-medium text-[24px] text-[#202020] text-center tracking-[-1px] h-[37px] flex items-center justify-center"
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
};

const WanderoSlotMachine: React.FC<WanderoSlotMachineProps> = ({
  activities,
  activeFilters,
  onSpin,
  onActivitySelect,
  onClose,
  spinCount
}) => {
  const [spinning, setSpinning] = useState(false);
  const [slots, setSlots] = useState<Activity[]>([]);
  const [finalEmojis, setFinalEmojis] = useState<string[]>(['🎶', '🍿', '🛝']);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Stable background emojis for non-center rows (generated once and reused)
  const backgroundEmojis = useMemo(() => {
    return Array.from({ length: 5 }, (_, rowIndex) =>
      Array.from({ length: 3 }, (_, colIndex) =>
        SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)]
      )
    );
  }, []); // Empty dependency array means this never changes

  const handleSpin = () => {
    setSpinning(true);
    setShowResults(false);
    setShowConfetti(false);
    onSpin();

    // Reset to spinning state
    setFinalEmojis(['🎶', '🍿', '🛝']);

    setTimeout(() => {
      // Get all activities
      const allActivities = activities;
      
      // Filter by active filters if any
      let filteredActivities = allActivities;
      if (activeFilters.length > 0) {
        // Map slot machine legacy categories to new categories
        const categoryMap: Record<string, string[]> = {
          'outdoors': ['Nature', 'Sports', 'Playgrounds'],
          'arts': ['Arts', 'Museums'],
          'indoors': ['Indoors', 'Museums']
        };
        
        const matchingCategories = activeFilters.flatMap(filter => 
          categoryMap[filter.toLowerCase()] || []
        );
        
        if (matchingCategories.length > 0) {
          filteredActivities = allActivities.filter(activity => 
            matchingCategories.includes(activity.category)
          );
        }
      }
      
      const availableActivities = filteredActivities.length > 0 ? filteredActivities : allActivities;
      
      // Select 3 random activities (one for each time slot)
      const selectedActivities: Activity[] = [];
      
      for (let i = 0; i < 3; i++) {
        if (availableActivities.length > 0) {
          let randomActivity;
          let attempts = 0;
          do {
            randomActivity = availableActivities[Math.floor(Math.random() * availableActivities.length)];
            attempts++;
          } while (selectedActivities.some(slot => slot?.id === randomActivity?.id) && attempts < 10);
          
          selectedActivities.push(randomActivity);
        }
      }
      
      setSlots(selectedActivities);
      
      // Set final emojis for the reels
      const finalRow = selectedActivities.map(activity => activity.icon);
      setFinalEmojis(finalRow);
      
      setSpinning(false);
      
      // Show confetti and results after a brief delay
      setTimeout(() => {
        setShowConfetti(true);
        setShowResults(true);
        
        // Hide confetti after 3 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }, 500);
    }, 3000);
  };

  const timeLabels = ['Morning', 'Afternoon', 'Wild card'];
  const times = ['8am', '1:30pm', '6pm'];

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'radial-gradient(114.93% 114.93% at 129.17% 144.79%, #FFDECE 0%, #FF5300 100%)'
      }}
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.8}
          initialVelocityY={25}
          initialVelocityX={15}
        />
      )}

      {/* Content Container */}
      <div className="flex flex-col items-center justify-center px-6 py-8 text-center">
        
        {/* Header Text - matching Figma design */}
        <div className="mb-8 mt-4" style={{ marginTop: '3.75rem' }}>
          <h1 className="font-['Reddit_Sans'] font-bold text-[28px] text-[#ffffff] leading-normal tracking-[-2px] mb-0">One tap</h1>
          <h2 className="font-['Reddit_Sans'] font-bold text-[28px] text-[#ffffff] leading-normal tracking-[-2px]">One day sorted!</h2>
        </div>

        {/* Slot Machine Container - matching Figma design */}
        <div className="relative mb-8">
          {/* Semi-transparent background container */}
          <div className={`bg-[rgba(255,255,255,0.25)] rounded-2xl shadow-[0px_6px_16px_0px_rgba(0,0,0,0.12)] p-6 w-[325px] transition-all duration-500 h-auto relative`}>
            
            {/* Main slot machine area */}
            <div className="bg-[#ffffff] rounded-2xl p-6 w-[277px] h-auto relative mx-auto overflow-visible">
              
              {/* Slot machine grid - 5 rows x 3 columns with all rows spinning */}
              <div className="grid grid-cols-3 gap-3 h-full" style={{ marginLeft: '-10px' }}>
                {/* Generate 5 rows of spinning reels */}
                {Array.from({ length: 5 }, (_, rowIndex) => 
                  Array.from({ length: 3 }, (_, colIndex) => {
                    // For the center row (row 2), use the final emojis, otherwise use stable background emojis
                    const finalEmoji = rowIndex === 2 ? finalEmojis[colIndex] : backgroundEmojis[rowIndex][colIndex];
                    const isActiveRow = rowIndex === 2;
                    
                    return (
                      <SlotReel
                        key={`${rowIndex}-${colIndex}`}
                        finalEmoji={finalEmoji}
                        spinning={spinning}
                        delay={colIndex * 200 + rowIndex * 50} // Stagger timing for wave effect
                        opacity={isActiveRow ? 1 : (rowIndex === 1 || rowIndex === 3 ? 0.75 : 0.5)}
                        zIndex={isActiveRow ? 999 : 100}
                      />
                    );
                  })
                )}
              </div>

              {/* Active slots highlight box - always visible, following Figma design but transparent */}
              <div className="absolute bg-[rgba(255,255,255,0.9)] rounded-[14px] shadow-[0px_8px_15px_0px_rgba(181,181,181,0.35)] pointer-events-none backdrop-blur-sm transition-all duration-500 ease-in-out" style={{
                width: showResults ? '108%' : '111%',
                top: showResults ? '85px' : '110px',
                left: '-5.5%',
                height: showResults ? 'auto' : '61px',
                zIndex: 100,
                display: showResults ? 'flex' : 'block',
                alignItems: showResults ? 'stretch' : 'initial',
                justifyContent: showResults ? 'center' : 'initial',
                rowGap: 'initial',
                flexDirection: showResults ? 'row' : 'initial',
                flexWrap: showResults ? 'nowrap' : 'initial',
                padding: showResults ? '0px 5%' : 'initial',
                border: showResults ? '1px solid #FFBF00' : 'none'
              }}>
                {/* Animated content injection when results are sorted */}
                <div className={`transition-opacity duration-500 ease-in-out ${showResults ? 'opacity-100' : 'opacity-0'} h-full flex flex-col items-center justify-center p-2`} style={{ width: showResults ? '95%' : 'auto' }}>
                  {showResults && (
                    <>
                      {/* Time Period Labels - Top Row */}
                      <div className="grid grid-cols-3 gap-[22px] w-full mb-2" style={{ justifyContent: 'space-around', marginBottom: '2.75rem' }}>
                        {timeLabels.map((label, index) => (
                          <div key={label} className="text-center transform transition-transform duration-300 ease-out" style={{ transitionDelay: `${index * 100}ms` }}>
                            <div className="font-['Reddit_Sans'] font-medium text-[16px] text-[#202020] tracking-[-1px]">
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Times - Bottom Row */}
                      <div className="grid grid-cols-3 gap-[22px] w-full">
                        {times.map((time, index) => (
                          <div key={time} className="text-center transform transition-transform duration-300 ease-out" style={{ transitionDelay: `${(index + 3) * 100}ms` }}>
                            <div className="font-['Reddit_Sans'] font-normal text-[14px] text-[#202020] opacity-75 tracking-[-1px]">
                              {time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            
          </div>

                     {/* Expanded Results Section */}
           {showResults && (
             <div className="mt-6 bg-[#ffffff] rounded-[14px] p-[21px] w-[277px] mx-auto border-2 border-[#FFBF00] shadow-[0px_8px_15px_0px_rgba(253,160,85,0.35)]" style={{ display: 'none' }}>
               {/* Time Period Labels now injected into highlight box above */}

                             


            </div>
          )}
        </div>

        {/* Action Buttons */}
        {showResults ? (
          <div className="flex flex-col gap-4 mb-8">
            {/* Check Activities Button */}
            <Button 
              className="bg-[#ffffff] hover:bg-gray-100 text-[#202020] font-['Reddit_Sans'] font-bold text-[16px] uppercase tracking-[-1px] px-[22px] py-3 h-14 rounded-[34px] shadow-[0px_8px_15px_0px_rgba(165,93,35,0.35)] transition-all duration-200"
              onClick={() => onActivitySelect(slots)}
            >
              CHECK ACTIVITIES
            </Button>

            {/* Spin My Day Button */}
            <Button 
              onClick={handleSpin}
              disabled={spinning}
              className="bg-[#202020] hover:bg-[#303030] text-[#ffffff] font-['Reddit_Sans'] font-bold text-[16px] uppercase tracking-[-1px] px-[22px] py-3 h-14 rounded-[34px] shadow-[0px_8px_15px_0px_rgba(165,93,35,0.35)] transition-all duration-200 flex items-center gap-2"
            >
              <RotateCcw className={`h-8 w-8 ${spinning ? 'animate-spin' : ''}`} />
              SPIN MY DAY
            </Button>
          </div>
        ) : (
          /* Initial Spin Button */
          <Button 
            onClick={handleSpin}
            disabled={spinning}
            className="bg-[#202020] hover:bg-[#303030] text-[#ffffff] font-['Reddit_Sans'] font-bold text-[16px] uppercase tracking-[-1px] px-[22px] py-3 h-14 rounded-[34px] shadow-[0px_8px_15px_0px_rgba(165,93,35,0.35)] transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:scale-100 mb-8 flex items-center gap-2"
          >
            <RotateCcw className={`h-8 w-8 ${spinning ? 'animate-spin' : ''}`} />
            SPIN MY DAY
          </Button>
        )}

        {/* Close Button - matching Figma design */}
        <Button 
          variant="outline" 
          className="border-2 border-[#ffffff] text-[#ffffff] bg-transparent hover:bg-white hover:text-[#202020] font-['Reddit_Sans'] font-bold text-[16px] uppercase tracking-[-1px] px-[22px] py-3 h-14 rounded-[34px] transition-all duration-200 flex items-center gap-2"
          onClick={onClose}
        >
          <X className="h-8 w-8" />
          CLOSE
        </Button>
      </div>
    </div>
  );
};

export default WanderoSlotMachine;