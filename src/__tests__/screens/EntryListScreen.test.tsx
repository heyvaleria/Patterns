import { render, fireEvent } from '@testing-library/react-native'
import { EntryListScreen } from '../../screens/EntryListScreen'
import { useEntries } from '../../hooks/useEntries'
import { Entry } from '../../types/database'

jest.mock('../../hooks/useEntries')

const mockUseEntries = useEntries as jest.MockedFunction<typeof useEntries>

const mockEntries: Entry[] = [
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

describe('EntryListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading indicator when state is loading', () => {
    mockUseEntries.mockReturnValue({
      state: { status: 'loading' },
      fetchEntries: jest.fn(),
      deleteEntry: jest.fn(),
    })

    const { getByTestId } = render(<EntryListScreen />)
    expect(getByTestId('loading')).toBeTruthy()
  })

  it('shows error message when state is error', () => {
    mockUseEntries.mockReturnValue({
      state: { status: 'error', message: 'Failed to fetch' },
      fetchEntries: jest.fn(),
      deleteEntry: jest.fn(),
    })

    const { getByText } = render(<EntryListScreen />)
    expect(getByText('Failed to fetch')).toBeTruthy()
  })

  it('shows empty message when no entries', () => {
    mockUseEntries.mockReturnValue({
      state: { status: 'success', entries: [] },
      fetchEntries: jest.fn(),
      deleteEntry: jest.fn(),
    })

    const { getByText } = render(<EntryListScreen />)
    expect(getByText('No entries yet. Start writing!')).toBeTruthy()
  })

  it('renders list of entries', () => {
    mockUseEntries.mockReturnValue({
      state: { status: 'success', entries: mockEntries },
      fetchEntries: jest.fn(),
      deleteEntry: jest.fn(),
    })

    const { getByText } = render(<EntryListScreen />)
    expect(getByText('First entry')).toBeTruthy()
    expect(getByText('Second entry')).toBeTruthy()
  })

  it('shows voice indicator for entries with transcript', () => {
    mockUseEntries.mockReturnValue({
      state: { status: 'success', entries: mockEntries },
      fetchEntries: jest.fn(),
      deleteEntry: jest.fn(),
    })

    const { getByText } = render(<EntryListScreen />)
    expect(getByText('Voice entry')).toBeTruthy()
  })

  it('calls deleteEntry when delete is pressed', () => {
    const mockDelete = jest.fn()
    mockUseEntries.mockReturnValue({
      state: { status: 'success', entries: [mockEntries[0]] },
      fetchEntries: jest.fn(),
      deleteEntry: mockDelete,
    })

    const { getByText } = render(<EntryListScreen />)
    fireEvent.press(getByText('Delete'))
    expect(mockDelete).toHaveBeenCalledWith('1')
  })
})
