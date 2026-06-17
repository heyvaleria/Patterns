import { useEffect, useState } from 'react'
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice'

type VoiceState =
  | { status: 'idle' }
  | { status: 'listening' }
  | { status: 'error'; message: string }

export function useVoice(onTranscript: (text: string) => void, language: string = 'en-US') {
  const [state, setState] = useState<VoiceState>({ status: 'idle' })

  useEffect(() => {
    // Register event handlers
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      const transcript = e.value?.[0]
      // e.value?.[] the ?. is optional chaining
      // It safely accesses [0] only if e.value exists,
      // otherwise returns undefined instead of crashing.
      if (transcript) {
        onTranscript(transcript)
        setState({ status: 'idle' })
      }
    }

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      const message = e.error?.message ?? 'Speech recognition failed'
      // the ?? is the nullish coalescing operator. It returns the right side
      // only if the left side is null or undefined. Different
      // from || which also triggers on false and 0.
      setState({ status: 'error', message })
    }

    Voice.onSpeechStart = () => {
      setState({ status: 'listening' })
    }

    Voice.onSpeechEnd = () => {
      setState({ status: 'idle' })
    }

    // Cleanup — remove handlers when component unmounts
    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])
  // ^ empty array — register handlers once on mount

  const startListening = async () => {
    try {
      await Voice.start(language)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not start voice'
      setState({ status: 'error', message })
    }
  }

  const stopListening = async () => {
    try {
      await Voice.stop()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not stop voice'
      setState({ status: 'error', message })
    }
  }

  return { state, startListening, stopListening }
}
