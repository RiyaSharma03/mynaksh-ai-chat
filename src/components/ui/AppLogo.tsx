import { Image } from 'react-native';

const LOGO = require('../../assets/logo.png');

/** The app logo (crescent moon), also used as the AI astrologer's avatar. */
export function AppLogo({ size }: { size: number }) {
  return (
    <Image
      source={LOGO}
      style={{ width: size, height: size }}
      accessibilityIgnoresInvertColors
    />
  );
}
