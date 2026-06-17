import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { AuthState, AuthUser } from '../types/auth'

type AuthStore = {
  state: AuthState
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  state: { status: 'loading' },

  initialize: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email!,
        }
        set({ state: { status: 'authenticated', user } })
      } else {
        set({ state: { status: 'unauthenticated' } })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to initialize'
      set({ state: { status: 'error', message } })
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ state: { status: 'loading' } })

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      // onAuthStateChange handles setting authenticated state
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      set({ state: { status: 'error', message } })
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ state: { status: 'unauthenticated' } })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign out failed'
      set({ state: { status: 'error', message } })
    }
  },
}))

// Zustand is a state management library — it solves the problem of sharing
// state between components that aren't directly connected.

// In React Native, every component has its own local state via useState.
// That's fine for a single component. But what about auth state?
// Every screen needs to know if the user is logged in. You can't pass that
// through props across the whole app — it becomes a mess called "prop drilling."

// Zustand solves this by creating a store — a piece of state that lives
// outside any component, globally, and any component can read from it or
// write to it directly.

// Any component anywhere in the app can do this:
// const { state, signIn, signOut } = useAuthStore()
// No props, no context wiring, no Redux boilerplate. Just call the hook
// and you have the state.
