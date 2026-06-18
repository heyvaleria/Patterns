import { renderHook } from '@testing-library/react-native'
import { useVoice } from '../../hooks/useVoice'

describe('useVoice', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useVoice(jest.fn()))
    expect(result.current.state.status).toBe('idle')
  })
})
