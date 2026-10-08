import '../../global.css';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { colors } from '../constants/colors';
import { RootNavigator } from '../navigation/RootNavigator';
import { store } from '../store';

/** Our colours for React Navigation's header and screen background. */
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.foreground,
    border: colors.border,
  },
};

/** App-wide providers live here and only here. */
export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider>
          <KeyboardProvider>
            <BottomSheetModalProvider>
              <StatusBar barStyle="light-content" />
              <NavigationContainer theme={navigationTheme}>
                <RootNavigator />
              </NavigationContainer>
            </BottomSheetModalProvider>
          </KeyboardProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
