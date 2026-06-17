import { RootNavigator } from './src/navigation/RootNavigator'
import { useAuth } from './src/hooks/useAuth'

export default function App() {
  useAuth() // sets up the auth listener once at the root
  return <RootNavigator />
}
