import { ActionSheetIOS, Alert, Platform } from 'react-native';
import { IconButton } from '../ui/IconButton';
import { mockScenario } from '../../services/mocks/handlers/conversationHandlers';
import { useAppDispatch } from '../../store/hooks';
import { loadConversation } from '../../store/slices/conversationSlice';

const OPTIONS = [
  'Reload conversation',
  'Reload as empty',
  'Reload with network error',
] as const;
const SCENARIOS = ['normal', 'empty', 'error'] as const;

/** Header menu to demo the loading, empty and error states with the mock backend. */
export function DemoScenarioMenu() {
  const dispatch = useAppDispatch();

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
    <IconButton icon="⋯" onPress={open} accessibilityLabel="Demo scenarios" />
  );
}
