import { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useAuth } from '../hooks/useAuth'

export function LoginScreen() {
  const { state, signIn } = useAuth()

  // Local state for form inputs — private to this component
  // Why useState and not Zustand? useState is used for local component state.
  // Unlike Zustand which is global, useState is private to one component.
  // Perfect for form inputs — nobody else needs to know what the user is
  // currently typing.
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  // useState takes one argument, the initial value. the <string> the generic,
  // we are telling TS what type the state will hold. TS will infer automatically
  // and explicitly that the value is a string

  // Being explicit is clearer when the initial value doesn't tell the whole story:
  // Example:
  // useState<string | null>(null)
  // can be string or null — TypeScript can't infer this from null alone

  // the return value is an array and we use array destructuring, so that
  // const [email, setEmail] = useState<string>('')
  // [0] gets named 'email'
  // [1] gets named 'setEmail'
  // convention is thing and setThing
  // we can then use the variables (email and setEmail) directly

  // to mutate the value we always use the function like:
  // setEmail('user@example.com')
  // and never reassign it like:
  // email = 'user@example.com'

  const handleSignIn = async () => {
    if (!email || !password) return
    await signIn(email, password)
  }

  // Discriminated union in action — each status renders differently
  if (state.status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator testID='loading' />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patterns</Text>

      {state.status === 'error' && (
        <Text style={styles.error}>{state.message}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        autoCapitalize='none'
        keyboardType='email-address'
      />

      <TextInput
        style={styles.input}
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignIn}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    marginBottom: 48,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    fontSize: 14,
  },
})
