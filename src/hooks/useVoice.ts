import { useState } from 'react'

type VoiceState =
  | { status: 'idle' }
  | { status: 'listening' }
  | { status: 'error'; message: string }

export function useVoice(_onTranscript: (text: string) => void, _language: string = 'en-US') {
  const [state] = useState<VoiceState>({ status: 'idle' })

  const startListening = async () => {}

  const stopListening = async () => {}

  return { state, startListening, stopListening }
}
