import { renderHook, act } from '@testing-library/react-native'
import { useVoice } from '../../hooks/useVoice'

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

import Voice from '@react-native-voice/voice'
const mockVoice = Voice as jest.Mocked<typeof Voice>

describe('useVoice', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('starts in idle state', () => {
    const { result } = renderHook(() => useVoice(jest.fn()))
    expect(result.current.state.status).toBe('idle')
  })

  it('calls Voice.stop when stopListening is called', async () => {
    const { result } = renderHook(() => useVoice(jest.fn()))

    await act(async () => {
      await result.current.stopListening()
    })

    expect(mockVoice.stop).toHaveBeenCalled()
  })

  it('calls onTranscript callback with speech result', async () => {
    const onTranscript = jest.fn()
    renderHook(() => useVoice(onTranscript))

    await act(async () => {
      Voice.onSpeechResults?.({ value: ['hello world'] } as never)
    })

    expect(onTranscript).toHaveBeenCalledWith('hello world')
  })

  it('sets error state on speech error', async () => {
    const { result } = renderHook(() => useVoice(jest.fn()))

    await act(async () => {
      Voice.onSpeechError?.({
        error: { message: 'Recognition failed' },
      } as never)
    })

    expect(result.current.state.status).toBe('error')
    if (result.current.state.status === 'error') {
      expect(result.current.state.message).toBe('Recognition failed')
    }
  })
})

it('starts listening in English by default', async () => {
  const { result } = renderHook(() => useVoice(jest.fn()))

  await act(async () => {
    await result.current.startListening()
  })

  expect(mockVoice.start).toHaveBeenCalledWith('en-US')
})

it('starts listening in Italian when specified', async () => {
  const { result } = renderHook(() => useVoice(jest.fn(), 'it-IT'))

  await act(async () => {
    await result.current.startListening()
  })

  expect(mockVoice.start).toHaveBeenCalledWith('it-IT')
})
