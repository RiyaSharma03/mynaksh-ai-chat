import type { HumanMessage } from '../types';
import { MessageBubble, type GroupPosition } from './MessageBubble';
import { MessageText } from './MessageText';
import { SenderLabel } from './SenderLabel';
import { Timestamp } from './Timestamp';

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
        side="start"
        {...group}
        className="border border-primary bg-raised"
      >
        <MessageText text={message.text} className="text-foreground" />
      </MessageBubble>
      {group.isLastInGroup && (
        <Timestamp value={message.createdAt} side="start" />
      )}
    </>
  );
}
