import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'

// Always mock Supabase so tests don't make real network calls
jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('authStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAuthStore.setState({ state: { status: 'loading' } })
  })

  it('sets unauthenticated when no session exists', async () => {
    ;(mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    })

    await useAuthStore.getState().initialize()

    expect(useAuthStore.getState().state.status).toBe('unauthenticated')
  })

  it('sets authenticated when session exists', async () => {
    ;(mockSupabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-123', email: 'test@example.com' },
        },
      },
    })

    await useAuthStore.getState().initialize()

    const state = useAuthStore.getState().state
    expect(state.status).toBe('authenticated')
    if (state.status === 'authenticated') {
      expect(state.user.email).toBe('test@example.com')
    }
  })

  it('sets error state when initialization fails', async () => {
    ;(mockSupabase.auth.getSession as jest.Mock).mockRejectedValue(new Error('Network error'))

    await useAuthStore.getState().initialize()

    const state = useAuthStore.getState().state
    expect(state.status).toBe('error')
    if (state.status === 'error') {
      expect(state.message).toBe('Network error')
    }
  })
})

// About (mockSupabase.auth.getSession as jest.Mock).mockResolvedValue(...)
// and similar: this is one of those rare legitimate uses of a type cast —
// you're telling TypeScript "I know this is a mock, trust me" because the mock
// factory already replaced it with jest.fn(). The types just can't prove it
// statically.
