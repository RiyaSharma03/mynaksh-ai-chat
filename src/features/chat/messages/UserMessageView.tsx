import type { UserMessage } from '../types';
import { MessageBubble, type GroupPosition } from './MessageBubble';
import { MessageText } from './MessageText';
import { Timestamp } from './Timestamp';

export function UserMessageView({
  message,
  ...group
}: { message: UserMessage } & GroupPosition) {
  return (
    <>
      <MessageBubble side="end" {...group} className="bg-primary">
        <MessageText text={message.text} className="text-white" />
      </MessageBubble>
      {group.isLastInGroup && (
        <Timestamp value={message.createdAt} side="end" />
      )}
    </>
  );
}
