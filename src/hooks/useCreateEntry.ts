import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { NewEntry } from '../types/database'

type CreateEntryState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'error'; message: string }

export function useCreateEntry() {
  const { state: authState } = useAuthStore()
  const [state, setState] = useState<CreateEntryState>({ status: 'idle' })

  const saveEntry = async (content: string, transcript: string | null = null) => {
    if (authState.status !== 'authenticated') return

    try {
      setState({ status: 'saving' })

      const newEntry: NewEntry = {
        user_id: authState.user.id,
        content,
        transcript,
      }

      const { error } = await supabase.from('entries').insert(newEntry)

      if (error) throw error

      setState({ status: 'idle' })
      return true // signals success to the screen
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save entry'
      setState({ status: 'error', message })
      return false
    }
  }

  return { state, saveEntry }
}
