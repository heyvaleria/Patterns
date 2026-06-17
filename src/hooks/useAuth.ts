import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { state, signIn, signOut, initialize } = useAuthStore()

  useEffect(() => {
    initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        useAuthStore.setState({
          state: {
            status: 'authenticated',
            user: {
              id: session.user.id,
              email: session.user.email!,
            },
          },
        })
      } else {
        useAuthStore.setState({
          state: { status: 'unauthenticated' },
        })
      }
    })

    return () => subscription.unsubscribe()
    // ^ this is the cleanup function — runs when the component unmounts
    // without it you'd have a memory leak — the subscription keeps listening forever
  }, [])
  // ^ empty array means this effect runs once, when the component mounts

  return { state, signIn, signOut }
}

// useAuth is a custom hook. Its job is to:

// 1. Start listening to Supabase when the app loads
// 2. Keep the store updated when auth state changes
// 3. Clean up when it's done

// useEffect is React's way of saying "run this code as a side effect of rendering."

// A side effect is anything that reaches outside the component —
// network calls, subscriptions, timers. React wants to know about these so it
// can manage them properly.
// The structure is always:
// useEffect(() => {
//     setup code, runs after render
//     return () => {
//         cleanup code, runs before unmount
//     }
//}, [dependencies])
// The empty array [] at the end means "run this effect once, when the
// component first mounts." If you put a variable in there like [userId],
// it would re-run every time userId changes.

// first we initialize
// First thing we do is call initialize() from the store —
// that's the function that calls supabase.auth.getSession() to check if
// there's already a logged-in session. Think of it as "when the app opens,
// check if the user is already logged in."

// Then we write a subscription — you're telling Supabase:
// "whenever auth state changes, call this function."
// Supabase fires this callback automatically whenever:

// A user signs in
// A user signs out
// A session expires
// A session refreshes

// The callback receives session — if it exists, user is logged in,
// so we update the store to authenticated. If it's null, user signed out,
// so we set unauthenticated.
// The destructuring at the top { data: { subscription } } is just pulling out
// the subscription object that Supabase returns — we need it for cleanup.

// return () => subscription.unsubscribe()
// This is the cleanup function — it runs when the component that called
// useAuth unmounts (is removed from the screen).
// Without this, the subscription keeps running forever even after the
// component is gone — listening for auth changes, trying to update state
// that no longer exists. That's a memory leak.
