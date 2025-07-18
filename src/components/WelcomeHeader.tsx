import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeHeaderProps {
  userName?: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName = "Rachel" }) => {
  return (
    <div className="flex items-center justify-between mb-8 px-4 pt-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
          <span className="text-xl">👨‍💼</span>
        </div>
        
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeHeader;