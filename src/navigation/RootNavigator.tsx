import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConversationScreen } from '../screens/ConversationScreen';
import { colors } from '../theme/tokens';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Conversation"
        component={ConversationScreen}
        options={{ title: 'AI Astrologer' }}
      />
    </Stack.Navigator>
  );
}
