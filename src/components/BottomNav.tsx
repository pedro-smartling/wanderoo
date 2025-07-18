import React from 'react';
import { Home, Compass, Shuffle, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'discover', icon: Compass, label: 'Discover', path: '/discover' },
    { id: 'spin', icon: Shuffle, label: 'Spin a day', path: '/spin' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', path: '/calendar' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
  ];

  const handleTabClick = (tab: { id: string; path: string }) => {
    navigate(tab.path);
    onTabChange?.(tab.id);
  };

  const getCurrentActiveTab = () => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    return currentTab?.id || activeTab || 'home';
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = getCurrentActiveTab() === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => handleTabClick(tab)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;