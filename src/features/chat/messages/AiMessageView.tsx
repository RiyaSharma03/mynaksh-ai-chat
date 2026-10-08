import { FeedbackBar } from '../../feedback/components/FeedbackBar';
import { RecommendationRail } from '../../recommendations/components/RecommendationRail';
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
        messageId={message.id}
        side="start"
        {...group}
        className="border border-border bg-surface"
      >
        <MessageText text={message.text} className="text-foreground" />
      </MessageBubble>
      {message.recommendations.length > 0 && (
        <RecommendationRail recommendations={message.recommendations} />
      )}
      <FeedbackBar messageId={message.id} />
      {group.isLastInGroup && (
        <Timestamp value={message.createdAt} side="start" />
      )}
    </>
  );
}
