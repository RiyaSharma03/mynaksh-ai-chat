import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';

export function ConversationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Conversation goes here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  text: { ...typography.body, color: colors.textMuted },
});
