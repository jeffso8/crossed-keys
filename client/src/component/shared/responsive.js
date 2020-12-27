import { useMediaQuery } from 'react-responsive'

export const Responsive = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)'
  })
  const isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 800px)' });
  const isTabletOrMobileDevice = useMediaQuery({
    query: '(max-device-width: 1224px)'
  });
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' });

  return {isMobile, isTabletOrMobileDevice}
};