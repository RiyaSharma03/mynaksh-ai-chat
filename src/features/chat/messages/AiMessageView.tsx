import type { AiMessage } from '../types';
import { MessageBubble, type GroupPosition } from './MessageBubble';
import { MessageText } from './MessageText';
import { SenderLabel } from './SenderLabel';
import { Timestamp } from './Timestamp';

export function AiMessageView({
  message,
  ...group
}: { message: AiMessage } & GroupPosition) {
  return (
    <>
      {group.isFirstInGroup && <SenderLabel icon="✨" name="AI Astrologer" />}
      <MessageBubble
        side="start"
        {...group}
        className="border border-border bg-surface"
      >
        <MessageText text={message.text} className="text-foreground" />
      </MessageBubble>
      {/* Step 5: recommendation cards. Step 7: feedback. */}
      {group.isLastInGroup && (
        <Timestamp value={message.createdAt} side="start" />
      )}
    </>
  );
}
