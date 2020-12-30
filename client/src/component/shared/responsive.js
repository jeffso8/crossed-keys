import { useMediaQuery } from 'react-responsive';

export const Responsive = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 800px)' });
  const isTabletOrMobileDevice = useMediaQuery({
    query: '(max-device-width: 1224px)',
  });

  return { isMobile, isTabletOrMobileDevice };
};
