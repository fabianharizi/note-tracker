import { useState, useEffect } from 'react';

export default function useIsIOS() {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isMacWithTouch = userAgent.includes('mac') && navigator.maxTouchPoints > 1;
    setIsIOS(isIosDevice || isMacWithTouch);
  }, []);

  return isIOS;
}
