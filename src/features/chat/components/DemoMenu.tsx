import { ActionSheetIOS, Alert, Platform, Pressable, Text } from 'react-native';
import { env } from '../../../config/env';
import { mockScenario } from '../../../api/mock/mockConversationApi';
import { useAppDispatch } from '../../../store/hooks';
import { loadConversation } from '../conversationSlice';

const OPTIONS = [
  'Reload conversation',
  'Reload as empty',
  'Reload with network error',
] as const;
const SCENARIOS = ['normal', 'empty', 'error'] as const;

/**
 * Lets the demo show every load state without a server. Only exists in mock mode.
 */
export function DemoMenu() {
  const dispatch = useAppDispatch();
  if (env.apiMode !== 'mock') return null;

  const run = (index: number) => {
    const scenario = SCENARIOS[index];
    if (!scenario) return;
    mockScenario.load = scenario;
    dispatch(loadConversation());
  };

  const open = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: 'Demo scenarios',
          options: [...OPTIONS, 'Cancel'],
          cancelButtonIndex: OPTIONS.length,
        },
        run,
      );
    } else {
      Alert.alert('Demo scenarios', undefined, [
        ...OPTIONS.map((text, index) => ({ text, onPress: () => run(index) })),
        { text: 'Cancel', style: 'cancel' as const },
      ]);
    }
  };

  return (
    <Pressable
      onPress={open}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Demo scenarios"
    >
      <Text className="text-xl font-bold text-foreground">⋯</Text>
    </Pressable>
  );
}
