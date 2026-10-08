import { ActionSheetIOS, Alert, Platform } from 'react-native';

export interface Option {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

/**
 * The platform's own options menu: an action sheet on iOS, a dialog on
 * Android (tap outside to cancel; Android dialogs fit up to three options).
 */
export function showOptions(title: string, message: string, options: Option[]) {
  if (Platform.OS === 'ios') {
    const destructiveIndex = options.findIndex(option => option.destructive);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        message,
        options: [...options.map(option => option.label), 'Cancel'],
        cancelButtonIndex: options.length,
        destructiveButtonIndex:
          destructiveIndex >= 0 ? destructiveIndex : undefined,
      },
      index => options[index]?.onPress(),
    );
    return;
  }

  Alert.alert(
    title,
    message,
    options.map(option => ({
      text: option.label,
      style: option.destructive
        ? ('destructive' as const)
        : ('default' as const),
      onPress: option.onPress,
    })),
    { cancelable: true },
  );
}
