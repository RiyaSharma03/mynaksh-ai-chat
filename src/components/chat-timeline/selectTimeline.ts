import { createSelector } from '@reduxjs/toolkit';
import { selectAllMessages } from '../../store/slices/conversationSlice';
import { buildTimeline } from './buildTimeline';

/**
 * The timeline's rows (date separators + grouping), derived from the store.
 * Lives next to the list that renders them; memoized, so it recomputes only
 * when messages change.
 */
export const selectTimeline = createSelector([selectAllMessages], messages =>
  buildTimeline(messages),
);
