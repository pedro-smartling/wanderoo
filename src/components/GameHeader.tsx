import React from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenu?: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  title, 
  showBack = false, 
  onBack, 
  showMenu = true, 
  onMenu 
}) => {
  return (
    <div className="relative">
      {/* Header with green gradient background */}
      <div className="bg-gradient-to-r from-game-green to-game-green-light px-6 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          {showBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="w-9" />
          )}
          
          <h1 className="text-white font-bold text-lg text-center flex-1">
            {title}
          </h1>
          
          {showMenu ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenu}
              className="text-white hover:bg-white/20 p-2 rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
          ) : (
            <div className="w-9" />
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-16 left-8 w-6 h-6 bg-white/20 rounded-full animate-float" />
      <div className="absolute top-20 right-12 w-4 h-4 bg-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-24 right-20 w-2 h-2 bg-white/30 rounded-full animate-sparkle" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default GameHeader;