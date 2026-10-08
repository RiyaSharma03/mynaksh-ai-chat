import { Pressable, Text } from 'react-native';
import { mockScenario } from '../../services/mocks/conversationMock';
import { useAppDispatch } from '../../store/hooks';
import { loadConversation } from '../../store/slices/conversationSlice';
import { showOptions } from '../../utils/showOptions';

/** Header menu to demo the loading, empty and error states with the mock backend. */
export function DemoScenarioMenu() {
  const dispatch = useAppDispatch();

  const reload = (scenario: typeof mockScenario.load) => {
    mockScenario.load = scenario;
    dispatch(loadConversation());
  };

  const open = () =>
    showOptions('Demo scenarios', 'Reload the conversation as…', [
      { label: 'Normal', onPress: () => reload('normal') },
      { label: 'Empty', onPress: () => reload('empty') },
      { label: 'Network error', onPress: () => reload('error') },
    ]);

  return (
    <Pressable
      onPress={open}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Demo scenarios"
      className="active:opacity-60"
    >
      <Text className="text-lg font-bold text-foreground">⋯</Text>
    </Pressable>
  );
}
