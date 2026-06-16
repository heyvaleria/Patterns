import { useAuth } from './src/hooks/useAuth'
import { LoginScreen } from './src/screens/LoginScreen'
import { View, Text } from 'react-native'

export default function App() {
  const { state } = useAuth()

  if (state.status === 'loading') return null

  if (state.status === 'unauthenticated' || state.status === 'error') {
    return <LoginScreen />
  }

  // Temporary placeholder — will be replaced with real navigation soon
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {state.user.email}</Text>
    </View>
    // TypeScript knows state.user exists without you having to check.
    // The discriminated union narrowed it automatically.
  )
}
