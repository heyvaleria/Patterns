import { renderHook, act } from '@testing-library/react-native'
import { useEntries } from '../../hooks/useEntries'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })),
  },
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>

const mockEntries = [
  {
    id: '1',
    user_id: 'user-123',
    content: 'First entry',
    transcript: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    user_id: 'user-123',
    content: 'Second entry',
    transcript: 'spoken words',
    created_at: '2026-01-02T00:00:00Z',
  },
]

describe('useEntries', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    useAuthStore.setState({
      state: {
        status: 'authenticated',
        user: { id: 'user-123', email: 'test@example.com' },
      },
    })
  })

  it('fetches entries successfully', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockEntries,
          error: null,
        }),
      }),
    })

    const { result } = renderHook(() => useEntries())

    await act(async () => {
      await result.current.fetchEntries()
    })

    expect(result.current.state.status).toBe('success')
    if (result.current.state.status === 'success') {
      expect(result.current.state.entries).toHaveLength(2)
      expect(result.current.state.entries[0].content).toBe('First entry')
    }
  })

  it('sets error state when fetch fails', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Network error'),
        }),
      }),
    })

    const { result } = renderHook(() => useEntries())

    await act(async () => {
      await result.current.fetchEntries()
    })

    expect(result.current.state.status).toBe('error')
    if (result.current.state.status === 'error') {
      expect(result.current.state.message).toBe('Network error')
    }
  })

  it('does not fetch when user is not authenticated', async () => {
    useAuthStore.setState({
      state: { status: 'unauthenticated' },
    })

    renderHook(() => useEntries())

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(supabase.from).not.toHaveBeenCalled()
  })
})
