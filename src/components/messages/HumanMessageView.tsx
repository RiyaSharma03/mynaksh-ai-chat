import type { HumanMessage } from '../../types/message';
import { MessageBubble, type GroupPosition } from './MessageBubble';
import { MessageText } from './MessageText';
import { SenderLabel } from '../ui/SenderLabel';
import { MessageTime } from './MessageTime';

export function HumanMessageView({
  message,
  ...group
}: { message: HumanMessage } & GroupPosition) {
  return (
    <>
      {group.isFirstInGroup && (
        <SenderLabel icon="👨‍🏫" name={message.author.name} badge="Astrologer" />
      )}
      <MessageBubble
        messageId={message.id}
        side="start"
        {...group}
        className="border border-primary bg-raised"
      >
        <MessageText text={message.text} className="text-foreground" />
      </MessageBubble>
      {group.isLastInGroup && (
        <MessageTime value={message.createdAt} side="start" />
      )}
    </>
  );
}
