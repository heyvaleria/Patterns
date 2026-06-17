// Mock Supabase for tests
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

// Mock AsyncStorage for all tests
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

// Mock Voice
// there is an issue with @react-native-voice/voice in the Jest environment
// the native module doesn't exist so the NativeEventEmitter it tries to
// create fails.
jest.mock('@react-native-voice/voice', () => ({
  __esModule: true,
  default: {
    start: jest.fn(),
    stop: jest.fn(),
    destroy: jest.fn().mockResolvedValue(null),
    removeAllListeners: jest.fn(),
    onSpeechResults: null,
    onSpeechError: null,
    onSpeechStart: null,
    onSpeechEnd: null,
  },
}))
