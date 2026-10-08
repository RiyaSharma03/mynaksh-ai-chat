import { forwardRef } from 'react';
import type { ScrollViewProps } from 'react-native';
import {
  KeyboardChatScrollView,
  type KeyboardChatScrollViewRef,
} from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * The list's scroll view: lifts the messages with the keyboard, in sync
 * with its animation. `offset` is the safe-area gap the keyboard covers
 * anyway, so content moves only by keyboardHeight - offset.
 */
export const KeyboardAwareChatScroll = forwardRef<
  KeyboardChatScrollViewRef,
  ScrollViewProps
>((props, ref) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <KeyboardChatScrollView
      ref={ref}
      offset={bottom}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      keyboardDismissMode="interactive"
      {...props}
    />
  );
});
