import { cn } from '../../../utils/cn';
import type { UserMessage } from '../types';
import { DeliveryStatus } from './DeliveryStatus';
import { MessageBubble, type GroupPosition } from './MessageBubble';
import { MessageText } from './MessageText';

export function UserMessageView({
  message,
  ...group
}: { message: UserMessage } & GroupPosition) {
  // A failed or sending message always shows its status, even mid-group.
  const showStatus = group.isLastInGroup || message.status !== 'sent';
  return (
    <>
      <MessageBubble
        side="end"
        {...group}
        className={cn(
          'bg-primary',
          message.status === 'sending' && 'opacity-70',
        )}
      >
        <MessageText text={message.text} className="text-white" />
      </MessageBubble>
      {showStatus && <DeliveryStatus message={message} />}
    </>
  );
}
