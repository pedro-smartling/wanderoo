import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      // Check user agent for mobile indicators
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        'mobile', 'android', 'iphone', 'ipad', 'ipod', 
        'blackberry', 'windows phone', 'webos'
      ];
      
      const isMobileUserAgent = mobileKeywords.some(keyword => 
        userAgent.includes(keyword)
      );

      // Check screen width (mobile typically < 768px)
      const isMobileWidth = window.innerWidth < 768;

      // Check for touch support
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Consider it mobile if any of these conditions are true
      const isMobileDevice = isMobileUserAgent || (isMobileWidth && hasTouchSupport);
      
      setIsMobile(isMobileDevice);
      setIsChecking(false);
    };

    // Check on mount
    checkMobile();

    // Check on resize
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isMobile, isChecking };
}; 