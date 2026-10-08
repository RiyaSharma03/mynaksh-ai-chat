import Config from 'react-native-config';

/**
 * Typed, validated access to .env values. The rest of the app imports `env`,
 * never react-native-config, so a missing or misspelled value fails here, once.
 */
export type ApiMode = 'mock' | 'http';

const apiMode: ApiMode = Config.API_MODE === 'http' ? 'http' : 'mock';

export const env = {
  apiMode,
  apiBaseUrl: Config.API_BASE_URL ?? '',
};

if (env.apiMode === 'http' && !env.apiBaseUrl) {
  throw new Error('API_MODE=http needs API_BASE_URL in .env');
}
