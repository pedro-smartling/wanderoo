import React from 'react';
import { Home, Search, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onSpinClick?: () => void;
}

// Custom SVG icons to match Figma design
const SpinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 28 28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.64 15.812V19.634C18.64 22.826 17.366 24.1 14.174 24.1H10.366C7.188 24.1 5.9 22.826 5.9 19.634V15.812C5.9 12.634 7.174 11.36 10.366 11.36H14.188C17.366 11.36 18.64 12.634 18.64 15.812Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M24.1 10.352V14.174C24.1 17.366 22.826 18.64 19.634 18.64H18.64V15.812C18.64 12.634 17.366 11.36 14.174 11.36H11.36V10.352C11.36 7.16 12.634 5.9 15.826 5.9H19.648C22.826 5.9 24.1 7.174 24.1 10.352Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M29 19.2C29 24.618 24.618 29 19.2 29L20.67 26.55"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M1 10.8C1 5.382 5.382 1 10.8 1L9.33 3.45"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onSpinClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { id: 'home', icon: Home, label: 'Home', path: '/home' },
    { id: 'discover', icon: Search, label: 'Discover', path: '/discover' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', path: '/calendar' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
  ];

  const handleTabClick = (tab: { id: string; path: string }) => {
    navigate(tab.path);
    onTabChange?.(tab.id);
  };

  const handleSpinClick = () => {
    // Navigate to dedicated spin a day page
    navigate('/spin');
    onTabChange?.('spin');
  };

  const getCurrentActiveTab = () => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    return currentTab?.id || activeTab || 'home';
  };

  const currentActive = getCurrentActiveTab();

  return (
    <div 
      className="sticky bottom-0 left-0 right-0 z-50"
      style={{
        width: '375px',
        position: 'fixed',
        margin: '0 auto',
        bottom: '74px',
        top: 'auto',
        zIndex: 1000
      }}
    >
      <div className="relative max-w-md mx-auto">
        {/* Custom curved background with shadow */}
        <div className="relative">
          <svg
            width="375"
            height="83"
            viewBox="0 0 375 83"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-lg"
          >
            <path
              d="M0 30C0 18.9543 8.95431 10 20 10H136.004C142.513 10 148.076 11.8894 151.949 17.1201C159.903 27.8596 166.557 43 187.5 43C208.481 43 215.75 27.8049 223.985 17.062C227.945 11.8962 233.487 10 239.996 10H355C366.046 10 375 18.9543 375 30V83H0V30Z"
              fill="white"
            />
          </svg>
          

        </div>

        {/* Navigation content */}
        <div className="absolute top-0 left-0 right-0 h-[83px] flex items-start justify-between px-0 pt-2.5">
          {/* Home icon */}
          <div className="flex flex-col items-center justify-center w-[76px]">
            <Button
              variant="ghost"
              size="sm"
              className={`p-0 h-6 w-6 ${
                currentActive === 'home' ? 'text-[#FFA800]' : 'text-[#B9C2D1]'
              }`}
              style={{ marginTop: '12px' }}
              onClick={() => handleTabClick(tabs[0])}
            >
              <Home className="h-6 w-6" />
            </Button>
          </div>

          {/* Search icon */}
          <div className="flex flex-col items-center justify-center w-[77px]">
            <Button
              variant="ghost"
              size="sm"
              className={`p-0 h-6 w-6 ${
                currentActive === 'discover' ? 'text-[#FFA800]' : 'text-[#B9C2D1]'
              }`}
              style={{ marginTop: '12px' }}
              onClick={() => handleTabClick(tabs[1])}
            >
              <Search className="h-6 w-6" />
            </Button>
          </div>

          {/* Center elevated spin button */}
          <div className="flex flex-col items-center justify-center w-[56px] relative -top-7">
            <Button
              className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFA800] to-[#FF6B35] hover:from-[#FF6B35] hover:to-[#FFA800] shadow-[0px_8px_15px_0px_rgba(253,160,85,0.35)] border-0 p-0"
              onClick={handleSpinClick}
            >
              <SpinIcon className="!h-[28px] !w-[28px] text-white" />
            </Button>
          </div>

          {/* Calendar icon */}
          <div className="flex flex-col items-center justify-center w-[76px]">
            <Button
              variant="ghost"
              size="sm"
              className={`p-0 h-6 w-6 ${
                currentActive === 'calendar' ? 'text-[#FFA800]' : 'text-[#B9C2D1]'
              }`}
              style={{ marginTop: '12px' }}
              onClick={() => handleTabClick(tabs[2])}
            >
              <Calendar className="h-6 w-6" />
            </Button>
          </div>

          {/* Profile icon */}
          <div className="flex flex-col items-center justify-center w-[77px]">
            <Button
              variant="ghost"
              size="sm"
              className={`p-0 h-6 w-6 ${
                currentActive === 'profile' ? 'text-[#FFA800]' : 'text-[#B9C2D1]'
              }`}
              style={{ marginTop: '12px' }}
              onClick={() => handleTabClick(tabs[3])}
            >
              <User className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;