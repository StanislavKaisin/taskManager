import { useState, useEffect } from 'react';

const useScreenWidth = () => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);

    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  return width;
};

export default useScreenWidth;