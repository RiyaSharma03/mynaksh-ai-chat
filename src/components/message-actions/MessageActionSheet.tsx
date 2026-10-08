import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useTheme } from '../../theme/useTheme';
import { cn } from '../../utils/cn';
import {
  deliverMessage,
  messageRemoved,
  messageSelected,
  replyStarted,
  selectSelectedMessage,
} from '../../store/slices/conversationSlice';
import {
  getMessageActions,
  type MessageAction,
} from '../../utils/getMessageActions';
import { previewText, senderName } from '../../utils/senderName';
import type { Message } from '../../types/message';

const ACTION_LABELS: Record<MessageAction, { icon: string; label: string }> = {
  reply: { icon: '↩︎', label: 'Reply' },
  copy: { icon: '⧉', label: 'Copy' },
  retry: { icon: '↻', label: 'Retry' },
  delete: { icon: '🗑', label: 'Delete' },
};

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
);

/**
 * Mounted once on the screen. Opens whenever a message is selected in the
 * store (by a long-press anywhere in the list), so no callbacks are passed
 * down through the list.
 */
export function MessageActionSheet() {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);
  const selected = useAppSelector(selectSelectedMessage);

  // Keep showing the last message while the sheet animates closed, even
  // after it is deleted from the store.
  const [shown, setShown] = useState<Message | null>(null);

  useEffect(() => {
    if (selected) {
      setShown(selected);
      sheetRef.current?.present();
    }
  }, [selected]);

  const onDismiss = useCallback(
    () => dispatch(messageSelected(null)),
    [dispatch],
  );

  const run = (action: MessageAction) => {
    if (!shown) return;
    sheetRef.current?.dismiss();
    switch (action) {
      case 'reply':
        dispatch(replyStarted(shown.id));
        break;
      case 'copy':
        Clipboard.setString(shown.text);
        break;
      case 'retry':
        dispatch(deliverMessage(shown.id));
        break;
      case 'delete':
        dispatch(messageRemoved(shown.id));
        break;
    }
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      onDismiss={onDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
    >
      <BottomSheetView style={{ paddingBottom: bottom + 8 }}>
        {shown && (
          <>
            <View className="mx-4 mb-2 rounded-xl bg-raised px-3 py-2.5">
              <Text className="text-xs font-semibold text-muted">
                {senderName(shown)}
              </Text>
              <Text className="text-sm text-foreground" numberOfLines={3}>
                {previewText(shown)}
              </Text>
            </View>
            {getMessageActions(shown).map(action => (
              <Pressable
                key={action}
                onPress={() => run(action)}
                accessibilityRole="button"
                className="flex-row items-center gap-4 px-6 py-3.5 active:bg-raised"
              >
                <Text
                  className={cn(
                    'w-6 text-center text-lg',
                    action === 'delete' ? 'text-danger' : 'text-foreground',
                  )}
                >
                  {ACTION_LABELS[action].icon}
                </Text>
                <Text
                  className={cn(
                    'text-base',
                    action === 'delete' ? 'text-danger' : 'text-foreground',
                  )}
                >
                  {ACTION_LABELS[action].label}
                </Text>
              </Pressable>
            ))}
          </>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}
