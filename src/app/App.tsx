import '../../global.css';
import { useMemo } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { RootNavigator } from '../navigation/RootNavigator';
import { store } from '../store';
import { ThemeProvider } from '../theme/ThemeProvider';
import { useTheme } from '../theme/useTheme';

/**
 * App-wide providers live here and only here. Screens never set up providers themselves.
 */
export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider>
          <KeyboardProvider>
            <ThemeProvider>
              {/* Inside ThemeProvider so sheets get the theme's colour variables. */}
              <BottomSheetModalProvider>
                <ThemedNavigation />
              </BottomSheetModalProvider>
            </ThemeProvider>
          </KeyboardProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

/** Feeds our palette into React Navigation, so headers and screen backgrounds follow the theme. */
function ThemedNavigation() {
  const { scheme, colors } = useTheme();

  const navigationTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.foreground,
        border: colors.border,
      },
    };
  }, [scheme, colors]);

  return (
    <>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <NavigationContainer theme={navigationTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}
