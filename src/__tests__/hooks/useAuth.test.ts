import { useAuthStore } from '../../store/authStore'

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

// Get the mocked version so we can control what it returns
const { supabase } = require('../../lib/supabase')

describe('authStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useAuthStore.setState({ state: { status: 'loading' } })
  })

  it('sets unauthenticated when no session exists', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
    })

    await useAuthStore.getState().initialize()

    expect(useAuthStore.getState().state.status).toBe('unauthenticated')
  })

  it('sets authenticated when session exists', async () => {
    supabase.auth.getSession.mockResolvedValue({
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
    supabase.auth.getSession.mockRejectedValue(new Error('Network error'))

    await useAuthStore.getState().initialize()

    const state = useAuthStore.getState().state
    expect(state.status).toBe('error')
    if (state.status === 'error') {
      expect(state.message).toBe('Network error')
    }
  })
})
