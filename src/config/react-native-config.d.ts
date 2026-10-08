// Declares our .env keys so `Config.API_MODE` is typed.
declare module 'react-native-config' {
  export interface NativeConfig {
    API_MODE?: string;
    API_BASE_URL?: string;
  }
  export const Config: NativeConfig;
  export default Config;
}
