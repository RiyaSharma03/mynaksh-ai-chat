import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConversationScreen } from '../screens/ConversationScreen';
import { ThemeToggle } from '../theme/ThemeToggle';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{ title: 'AI Astrologer', headerRight: ThemeToggle }}
      />
    </Stack.Navigator>
  );
}
