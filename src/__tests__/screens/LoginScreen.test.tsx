import { render, fireEvent } from '@testing-library/react-native'
import { LoginScreen } from '../../screens/LoginScreen'
import { useAuth } from '../../hooks/useAuth'

jest.mock('../../hooks/useAuth')

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({
      state: { status: 'unauthenticated' },
      signIn: jest.fn(),
      signOut: jest.fn(),
    })
  })

  it('renders the app name', () => {
    const { getByText } = render(<LoginScreen />)
    expect(getByText('Patterns')).toBeTruthy()
  })

  it('renders email and password inputs', () => {
    const { getByPlaceholderText } = render(<LoginScreen />)
    expect(getByPlaceholderText('Email')).toBeTruthy()
    expect(getByPlaceholderText('Password')).toBeTruthy()
  })

  it('calls signIn with email and password when button pressed', async () => {
    const mockSignIn = jest.fn()
    mockUseAuth.mockReturnValue({
      state: { status: 'unauthenticated' },
      signIn: mockSignIn,
      signOut: jest.fn(),
    })

    const { getByPlaceholderText, getByText } = render(<LoginScreen />)

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com')
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123')
    fireEvent.press(getByText('Sign in'))

    expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('shows error message when auth state is error', () => {
    mockUseAuth.mockReturnValue({
      state: { status: 'error', message: 'Invalid credentials' },
      signIn: jest.fn(),
      signOut: jest.fn(),
    })

    const { getByText } = render(<LoginScreen />)
    expect(getByText('Invalid credentials')).toBeTruthy()
  })

  it('shows loading indicator when state is loading', () => {
    mockUseAuth.mockReturnValue({
      state: { status: 'loading' },
      signIn: jest.fn(),
      signOut: jest.fn(),
    })

    const { getByTestId } = render(<LoginScreen />)
    expect(getByTestId('loading')).toBeTruthy()
  })
})
