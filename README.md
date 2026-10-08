# MyNaksh: AI Conversation Experience

A React Native chat screen where AI answers can carry **recommendation cards** (gemstone, tarot, consultation, article, offer, remedy, panchang, and types the app doesn't know yet), with replies from a human astrologer, optimistic sending, long-press actions and AI feedback.

**Stack:** React Native 0.87 (CLI, New Architecture) · TypeScript · Redux Toolkit · React Navigation 7 · Reanimated 4 · FlashList v2 · NativeWind 4 · react-native-keyboard-controller · Jest

---

## Running it

Requires Node 22.11+, Xcode with an iOS simulator, and CocoaPods (via Bundler).

```bash
npm install
bundle install && cd ios && bundle exec pod install && cd ..
npm start          # Metro
npm run ios        # in a second terminal
npm test           # 36 unit tests
```

There is no backend. The app runs on an in-app mock API (`USE_MOCK_API = true` in `src/services/env.ts`).

### Things to try

| Do this | You'll see |
|---|---|
| Send any message | **Sending…** → **Sent**, typing dots, then an AI reply with cards |
| Mention *love*, *health* or *money* | A matching AI reply and recommendations |
| Send a message with no keyword | A reply including **`live_puja`**, a type the app doesn't know, rendered as the fallback "For you" card |
| Include the word **"fail"** | **Failed to send · Retry** |
| Mention *astrologer*, *human* or *expert*, or tap **Talk now** on a consultation card | "Acharya Vinod has joined", his typing indicator, then his reply |
| Long-press a message | Reply / Copy / Delete (Retry / Copy / Delete on a failed one) |
| Reply | A "Replying to…" bar above the input; the sent message quotes the original |
| 👎 on an AI answer | Reason chips: Inaccurate, Too Generic, Didn't Help, Too Long |
| **⋯** in the header | Reload the conversation as *Normal*, *Empty* or *Network error* (fails once, then Retry recovers) |

---

## Project structure

```
src/
├── app/App.tsx                 Providers: Redux, gestures, safe area, keyboard, navigation
├── navigation/RootNavigator    Native stack with the one screen
├── screens/ConversationScreen  Picks loading / error / empty / chat; holds the composer
│
├── components/                 UI only, at most two levels deep
│   ├── ui/                     Small shared pieces: AppLogo, ScreenMessage, SenderLabel
│   ├── chat-header/            DemoScenarioMenu
│   ├── chat-timeline/          MessageList, MessageRow, TypingIndicator
│   ├── messages/               MessageBubble, UserMessage, IncomingMessage, FeedbackBar
│   ├── composer/               Composer (with the reply preview)
│   └── recommendations/        RecommendationCarousel (with the card)
│
├── constants/
│   ├── recommendationTypes.tsx Every recommendation type, plus the fallback
│   └── colors.ts               The (dark) palette, also used by Tailwind
│
├── store/                      Redux: index, typed hooks, slices/conversationSlice
├── services/                   Everything backend-related
│   ├── env.ts                  USE_MOCK_API, API_BASE_URL
│   ├── conversationService.ts  The interface + the mock/real switch
│   ├── api/                    The real backend (client.ts, conversationApi.ts), ready but unused
│   ├── mocks/                  conversationMock.ts + data/ (initial messages, replies)
│   └── utils/normalizeMessages Raw server data → typed messages
├── types/                      message, recommendation, feedback
├── utils/                      timeline (dates + grouping), message (sender, actions), showOptions, cn
└── assets/logo.png

__tests__/                      All tests, one file per module under test
```

Naming: a file is named after what it exports (components in PascalCase). `utils/` files are grouped by topic.

---

## Component architecture

```
ConversationScreen
├── ScreenMessage                   loading | error + Retry | empty
├── MessageList                     FlashList of timeline rows
│   ├── DateSeparator               "Yesterday" / "Today"
│   ├── MessageRow  (memo)          selects ONE message by id
│   │   ├── UserMessage             MessageBubble + quoted reply + Sending / Sent / Failed · Retry
│   │   ├── IncomingMessage         AI or astrologer: SenderLabel + MessageBubble
│   │   │   ├── RecommendationCarousel   (AI only)
│   │   │   └── FeedbackBar              (AI only)
│   │   └── system pill
│   └── TypingIndicator             names who is typing: the AI or the astrologer
└── Composer                        reply preview + input + send
```

- **Rows get an id, not data.** `MessageRow` receives an id and two grouping flags, and selects its own message from the store. Liking one message re-renders only that row, and nothing is passed down through the list.
- **The list renders rows, not messages.** `buildTimeline()` (in `utils/timeline.ts`) is a pure, tested function that adds date separators and grouping: same sender, same day, within 5 minutes, never for system events.
- **One bubble.** `MessageBubble` owns alignment, colours (`tone`: user / ai / astrologer), grouped corners and long-press. Long-press opens the platform's own menu (iOS action sheet, Android dialog) through `utils/showOptions`.
- **An exhaustive switch for message types.** `MessageRow` switches on `message.type`, and adding a type without handling it fails to compile. Message types are a closed set the app owns. Recommendation types are open, which is why they use a registry instead (see below).

---

## State management

**Redux Toolkit**, one slice (`store/slices/conversationSlice.ts`):

```ts
conversation: {
  ids, entities,            // messages, via createEntityAdapter, sorted by createdAt
  loadStatus,               // 'idle' | 'loading' | 'ready' | 'error'
  typingSender,             // who is typing a reply, or null
  replyToId,                // the message the composer is replying to
}
```

| Kind | What |
|---|---|
| Thunks | `loadConversation`, `sendMessage` (optimistic), `deliverMessage` (send and Retry), `saveFeedback` |
| Reducers | `messageRemoved`, `replyStarted` / `replyCancelled`, `feedbackRated`, `feedbackReasonToggled` |
| Selectors | `selectMessageById`, `selectTimeline` (memoized with `createSelector`), `selectTypingSender`, `selectReplyTarget`, … |

- **Normalized messages.** Updating one message replaces one entity, so only its row re-renders.
- **Optimistic sending.** The message appears at once with a client id (`nanoid`) and `status: 'sending'`. `deliverMessage`'s lifecycle drives the status: pending → *Sending…*, fulfilled → *Sent*, rejected → *Failed · Retry*. Retry dispatches the same thunk, so there's one code path. The id never changes, so the row never remounts, and a message deleted mid-send isn't brought back.
- **Replies from any sender.** After delivery, the backend decides who answers. The service reports who is typing (`onTyping`), and every reply is added with the same action, whether it's from the AI, an astrologer or a system event.
- **Feedback.** The reducer updates the UI immediately, then `saveFeedback` sends the message's current feedback to the API.
- **Local state where it belongs.** The composer's draft text stays in `useState`: nothing else reads it, and it avoids a store update on every keystroke.

### Backend layer

```
Redux thunks → conversationService (interface)
                  ├── mockConversationService   services/mocks   ← used now
                  └── apiConversationService    services/api     ← when a backend exists
```

The UI and Redux only know the `ConversationService` interface. One flag, `USE_MOCK_API` in `services/env.ts`, picks the implementation. Both run every response through `normalizeMessages`, which fills defaults (status, feedback, author, timestamps) and drops what can't be rendered. So components never null-check server data.

---

## Recommendation rendering strategy

A recommendation type is **an entry in a registry, not a branch in the UI.**

```ts
// constants/recommendationTypes.tsx
gemstone: {
  label: 'Gemstone',
  icon: '💎',
  accent: '#5DA9FF',
  ctaLabel: 'View gemstone',
  Body: ({ recommendation }) => <Detail>{readString(recommendation, 'price')}</Detail>,
},
consultation: {
  …,
  onPress: (_rec, { sendMessage }) => sendMessage("I'd like to talk to an astrologer."),
},
```

- **One shared card** (in `RecommendationCarousel.tsx`) owns layout, press feedback, accessibility and the button. A definition supplies only its identity, an optional `Body` for type-specific content, and an optional `onPress`. The default `onPress` shows an Alert, as the brief allows.
- **Actions are passed in.** `onPress` receives `{ showAlert, sendMessage }`, so definitions don't import Alert or Redux. That's how the consultation card starts a real astrologer handoff.
- **Forward compatible.** `Recommendation.type` is a plain `string`. Unknown types render with a fallback "For you" card instead of crashing, so the backend can ship a new experience before every app has updated. Unknown *message* types are skipped instead, since a message the app can't render would break the timeline.
- **Horizontal carousel.** A snap-scrolling `FlatList` per AI message, edge to edge, so the next card peeks in.

**Adding a type (e.g. `kundli`):** add one entry to `constants/recommendationTypes.tsx`. No other code changes.

---

## Performance considerations

- **FlashList v2** virtualizes the timeline, with `getItemType` so each kind of row (date, user, AI, astrologer, system, typing) recycles only into the same kind.
- **Chat behaviour built in:** `startRenderingFromBottom`, `maintainVisibleContentPosition` (the viewport stays put when a message is deleted) and `autoscrollToBottomThreshold: 0.2` (new messages scroll into view only if you're already near the bottom; your own sends always do).
- **Row-level selection + `memo`:** rows take primitive props and select their own message, so a status change, like or reply re-renders one row. The entity adapter keeps unchanged messages referentially equal.
- **Memoized derived data:** `selectTimeline` recomputes only when messages change.
- **UI-thread animation:** Reanimated runs the typing dots and the feedback chips' expand and collapse.
- **Keyboard:** `react-native-keyboard-controller` moves the list and composer frame by frame with the keyboard.
- **Recommendation cards** are memoized, inside a horizontal `FlatList` with snapping.

---

## Trade-offs (time-boxed)

| Decision | Why | Next step |
|---|---|---|
| Mock API only; the real `services/api` is written but never run | The brief says mock APIs are sufficient | Point `API_BASE_URL` at a server and set `USE_MOCK_API = false` |
| Over HTTP, the real API can't say *who* is typing before the reply arrives | Request/response has no push | A WebSocket for typing events and astrologer replies |
| No persistence or offline queue | Out of scope | Persist the store (e.g. MMKV) and queue failed sends |
| Feedback saves on every tap, fire-and-forget | Simple, and a failed save doesn't undo the user's choice | Debounce per message; retry failed saves |
| Native long-press menu instead of a custom sheet | No extra dependency; looks native on each platform | A custom sheet if a message preview or more actions are needed (Android dialogs fit three buttons) |
| `data` on recommendations is loosely typed, read through small safe readers | Keeps the registry simple | Per-type payload schemas (e.g. zod) |
| Single screen, dark theme only | Focus on the conversation architecture | Light theme from the same token names |
| Unit tests cover logic (slice, timeline, normalizer, registry, actions, feedback) but not components | Logic is where bugs hide; time-boxed | Component tests with React Native Testing Library |
| Verified on the iOS simulator only | Time | Run and polish on Android |
