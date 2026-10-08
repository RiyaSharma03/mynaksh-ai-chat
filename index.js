/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './src/app/App';
import { name as appName } from './app.json';

// NativeWind (react-native-css-interop 0.2.x) registers className support on every
// core component, which touches the deprecated ImageBackground. We never use it.
LogBox.ignoreLogs(['ImageBackground is deprecated']);

AppRegistry.registerComponent(appName, () => App);
