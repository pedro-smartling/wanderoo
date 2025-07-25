import React, { ReactNode } from 'react';

interface IPhoneFrameProps {
  children: ReactNode;
}

const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative">
        {/* iPhone Frame */}
        <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* iPhone Screen Container */}
          <div 
            className="relative bg-white rounded-[2.5rem] w-[375px] h-[812px] overflow-hidden"
          >
            
            {/* iPhone Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-black rounded-b-2xl w-[150px] h-[30px] flex items-center justify-center">
                {/* Speaker */}
                <div className="w-[50px] h-[4px] bg-gray-800 rounded-full"></div>
              </div>
            </div>

            {/* Status Bar Area */}
            <div className="absolute top-0 left-0 right-0 h-[44px] bg-transparent z-40 flex items-center justify-between px-6 pt-2" style={{ display: window.location.pathname === '/' ? 'none' : 'flex' }}>
              {/* Left side - Time */}
              <div className="text-black text-sm font-semibold">
                9:41
              </div>
              
              {/* Right side - Battery, WiFi, Cellular */}
              <div className="flex items-center space-x-1">
                {/* Cellular bars */}
                <div className="flex space-x-[2px]">
                  <div className="w-1 h-2 bg-black rounded-full"></div>
                  <div className="w-1 h-3 bg-black rounded-full"></div>
                  <div className="w-1 h-4 bg-black rounded-full"></div>
                  <div className="w-1 h-4 bg-black rounded-full"></div>
                </div>
                
                {/* WiFi */}
                <svg width="16" height="12" viewBox="0 0 16 12" className="fill-black">
                  <path d="M8 2C5.79 2 3.77 2.77 2.2 4.05L0.75 2.45C2.71 0.88 5.25 0 8 0C10.75 0 13.29 0.88 15.25 2.45L13.8 4.05C12.23 2.77 10.21 2 8 2ZM8 6C6.69 6 5.45 6.42 4.43 7.14L3 5.5C4.42 4.47 6.15 3.85 8 3.85C9.85 3.85 11.58 4.47 13 5.5L11.57 7.14C10.55 6.42 9.31 6 8 6ZM8 10C7.17 10 6.39 10.32 5.8 10.87L8 13L10.2 10.87C9.61 10.32 8.83 10 8 10Z"/>
                </svg>
                
                {/* Battery */}
                <div className="flex items-center">
                  <div className="w-6 h-3 border border-black rounded-sm relative">
                    <div className="w-full h-full bg-black rounded-sm"></div>
                  </div>
                  <div className="w-[2px] h-[6px] bg-black rounded-r-sm ml-[1px]"></div>
                </div>
              </div>
            </div>

            {/* App Content */}
            <div 
              className="absolute left-0 right-0 bottom-0 scrollbar-hide"
              style={{ top: 0, overflow: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="relative w-full h-full">
                {children}
              </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black rounded-full opacity-60 z-50"></div>
          </div>

          {/* Physical iPhone Elements */}
          {/* Volume Buttons */}
          <div className="absolute left-[-3px] top-[120px] w-[3px] h-[30px] bg-gray-700 rounded-l-sm"></div>
          <div className="absolute left-[-3px] top-[160px] w-[3px] h-[50px] bg-gray-700 rounded-l-sm"></div>
          
          {/* Power Button */}
          <div className="absolute right-[-3px] top-[140px] w-[3px] h-[60px] bg-gray-700 rounded-r-sm"></div>
        </div>

        {/* iPhone Shadow */}
        <div className="absolute -inset-4 bg-black/20 rounded-[4rem] blur-xl -z-10"></div>
        
        {/* Reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[3rem] pointer-events-none"></div>
      </div>
    </div>
  );
};

export default IPhoneFrame; 