/** Fake network delays, in ms. */
export const LATENCY_MS = 800;
export const AI_THINKING_MS = 1500;
export const HUMAN_TYPING_MS = 3000;

/** Demo switch for the loading, empty and error states (set from the header menu). */
export const mockScenario = {
  /** 'error' fails the next load only, so Retry recovers. */
  load: 'normal' as 'normal' | 'empty' | 'error',
};

const wait = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

/** Stands in for apiClient: waits like a network request, then answers. */
export const mockClient = {
  async respond<T>(data: T, delayMs = LATENCY_MS): Promise<T> {
    await wait(delayMs);
    return data;
  },

  async fail(message: string, delayMs = LATENCY_MS): Promise<never> {
    await wait(delayMs);
    throw new Error(message);
  },
};
