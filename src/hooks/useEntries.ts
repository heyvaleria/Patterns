import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'
import { Entry } from '../types/database'

type EntriesState =
  | { status: 'loading' }
  | { status: 'success'; entries: Entry[] }
  | { status: 'error'; message: string }
// discriminated union
// see src/types/auth.ts for more explanation

export function useEntries() {
  const { state: authState } = useAuthStore()
  const [state, setState] = useState<EntriesState>({ status: 'loading' })

  useEffect(() => {
    if (authState.status !== 'authenticated') return
    fetchEntries()
  }, [authState.status])

  const fetchEntries = async () => {
    try {
      setState({ status: 'loading' })

      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setState({ status: 'success', entries: data })
      // the functional update form of setState. When new state depends on
      // previous state, always use this form.
      // It's safer because React batches state updates and the direct form
      // can use a stale value.
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch entries'
      setState({ status: 'error', message })
    }
  }

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase.from('entries').delete().eq('id', id)

      if (error) throw error

      // Update local state immediately — no need to refetch
      setState((prev) => {
        if (prev.status !== 'success') return prev
        // here again it is the discriminated union where TS won't let us
        // access to prev.entries unless we confirm success status
        return {
          status: 'success',
          entries: prev.entries.filter((e) => e.id !== id),
        }
      })
    } catch (err: unknown) {
      // again we use type 'unknown' for errors, not 'any' type
      const message = err instanceof Error ? err.message : 'Failed to delete entry'
      setState({ status: 'error', message })
    }
  }

  return { state, fetchEntries, deleteEntry }
}
