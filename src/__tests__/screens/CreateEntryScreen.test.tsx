import { render, fireEvent } from '@testing-library/react-native'
import { CreateEntryScreen } from '../../screens/CreateEntryScreen'
import { useCreateEntry } from '../../hooks/useCreateEntry'

jest.mock('../../hooks/useCreateEntry')
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    setOptions: jest.fn(),
  }),
}))

const mockUseCreateEntry = useCreateEntry as jest.MockedFunction<typeof useCreateEntry>

describe('CreateEntryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCreateEntry.mockReturnValue({
      state: { status: 'idle' },
      saveEntry: jest.fn().mockResolvedValue(true),
    })
  })

  it('renders the text input', () => {
    const { getByPlaceholderText } = render(<CreateEntryScreen />)
    expect(getByPlaceholderText('Write or speak your entry...')).toBeTruthy()
  })

  it('renders the save button', () => {
    const { getByText } = render(<CreateEntryScreen />)
    expect(getByText('Save')).toBeTruthy()
  })

  it('calls saveEntry with content when save is pressed', async () => {
    const mockSave = jest.fn().mockResolvedValue(true)
    mockUseCreateEntry.mockReturnValue({
      state: { status: 'idle' },
      saveEntry: mockSave,
    })

    const { getByPlaceholderText, getByText } = render(<CreateEntryScreen />)

    fireEvent.changeText(
      getByPlaceholderText('Write or speak your entry...'),
      'My journal entry'
    )
    fireEvent.press(getByText('Save'))

    expect(mockSave).toHaveBeenCalledWith('My journal entry')
  })

  it('does not call saveEntry when content is empty', () => {
    const mockSave = jest.fn()
    mockUseCreateEntry.mockReturnValue({
      state: { status: 'idle' },
      saveEntry: mockSave,
    })

    const { getByText } = render(<CreateEntryScreen />)
    fireEvent.press(getByText('Save'))

    expect(mockSave).not.toHaveBeenCalled()
  })

  it('shows loading indicator when saving', () => {
    mockUseCreateEntry.mockReturnValue({
      state: { status: 'saving' },
      saveEntry: jest.fn(),
    })

    const { getByTestId } = render(<CreateEntryScreen />)
    expect(getByTestId('saving')).toBeTruthy()
  })

  it('shows error message when state is error', () => {
    mockUseCreateEntry.mockReturnValue({
      state: { status: 'error', message: 'Failed to save' },
      saveEntry: jest.fn(),
    })

    const { getByText } = render(<CreateEntryScreen />)
    expect(getByText('Failed to save')).toBeTruthy()
  })

  it('toggles language from English to Italian', () => {
    const { getByText } = render(<CreateEntryScreen />)

    expect(getByText('🇺🇸 EN')).toBeTruthy()

    fireEvent.press(getByText('🇺🇸 EN'))

    expect(getByText('🇮🇹 IT')).toBeTruthy()
  })

  it('toggles language back from Italian to English', () => {
    const { getByText } = render(<CreateEntryScreen />)

    fireEvent.press(getByText('🇺🇸 EN'))
    expect(getByText('🇮🇹 IT')).toBeTruthy()

    fireEvent.press(getByText('🇮🇹 IT'))
    expect(getByText('🇺🇸 EN')).toBeTruthy()
  })
})
