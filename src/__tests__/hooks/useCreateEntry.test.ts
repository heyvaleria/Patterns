import { renderHook, act } from '@testing-library/react-native'
import { useCreateEntry } from '../../hooks/useCreateEntry'
import { useAuthStore } from '../../store/authStore'
import { supabase } from '../../lib/supabase'

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('useCreateEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useAuthStore.setState({
      state: {
        status: 'authenticated',
        user: { id: 'user-123', email: 'test@example.com' },
      },
    })
  })

  it('saves entry successfully and returns true', async () => {
    ;(mockSupabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    })

    const { result } = renderHook(() => useCreateEntry())

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.saveEntry('My first entry')
    })

    expect(success).toBe(true)
    expect(result.current.state.status).toBe('idle')
  })

  it('sets error state when save fails', async () => {
    ;(mockSupabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockResolvedValue({
        error: new Error('Insert failed'),
      }),
    })

    const { result } = renderHook(() => useCreateEntry())

    let success: boolean | undefined
    await act(async () => {
      success = await result.current.saveEntry('My entry')
    })

    expect(success).toBe(false)
    expect(result.current.state.status).toBe('error')
    if (result.current.state.status === 'error') {
      expect(result.current.state.message).toBe('Insert failed')
    }
  })

  it('does not save when user is not authenticated', async () => {
    useAuthStore.setState({
      state: { status: 'unauthenticated' },
    })

    const { result } = renderHook(() => useCreateEntry())

    await act(async () => {
      await result.current.saveEntry('My entry')
    })

    expect(mockSupabase.from).not.toHaveBeenCalled()
  })

  it('sets saving state while saving', async () => {
    let resolveInsert: (value: unknown) => void
    const insertPromise = new Promise((resolve) => {
      resolveInsert = resolve
    })

    ;(mockSupabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnValue(insertPromise),
    })

    const { result } = renderHook(() => useCreateEntry())

    act(() => {
      result.current.saveEntry('My entry')
    })

    expect(result.current.state.status).toBe('saving')

    await act(async () => {
      resolveInsert!({ error: null })
    })

    expect(result.current.state.status).toBe('idle')
  })
})
