import { cn } from '../../utils/cn';
import type { UserMessage } from '../../types/message';
import { DeliveryStatus } from './DeliveryStatus';
import { MessageBubble, type GroupPosition } from './MessageBubble';
import { MessageText } from './MessageText';
import { QuotedReply } from './QuotedReply';

export function UserMessageView({
  message,
  ...group
}: { message: UserMessage } & GroupPosition) {
  // A failed or sending message always shows its status, even mid-group.
  const showStatus = group.isLastInGroup || message.status !== 'sent';
  return (
    <>
      <MessageBubble
        messageId={message.id}
        side="end"
        {...group}
        className={cn(
          'bg-primary',
          message.status === 'sending' && 'opacity-70',
        )}
      >
        {message.replyToId && <QuotedReply id={message.replyToId} />}
        <MessageText text={message.text} className="text-white" />
      </MessageBubble>
      {showStatus && <DeliveryStatus message={message} />}
    </>
  );
}
