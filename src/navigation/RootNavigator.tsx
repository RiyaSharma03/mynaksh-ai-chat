import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DemoScenarioMenu } from '../widgets/chat-header/DemoScenarioMenu';
import { ConversationScreen } from '../screens/ConversationScreen';
import { ThemeToggle } from '../widgets/chat-header/ThemeToggle';
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
          headerLeft: DemoScenarioMenu,
          headerRight: ThemeToggle,
        }}
      />
    </Stack.Navigator>
  );
}
