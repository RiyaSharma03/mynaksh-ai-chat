import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DemoMenu } from '../features/chat/components/DemoMenu';
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
        options={{
          title: 'AI Astrologer',
          headerLeft: DemoMenu,
          headerRight: ThemeToggle,
        }}
      />
    </Stack.Navigator>
  );
}
