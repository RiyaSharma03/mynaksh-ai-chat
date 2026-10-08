import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DemoScenarioMenu } from '../components/chat-header/DemoScenarioMenu';
import { ConversationScreen } from '../screens/ConversationScreen';

/** Screens and their params (none here). */
type RootStackParamList = {
  Conversation: undefined;
};

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
        }}
      />
    </Stack.Navigator>
  );
}
