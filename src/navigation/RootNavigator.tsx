import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useAuthStore } from '../store/authStore'
import { LoginScreen } from '../screens/LoginScreen'
import { EntryListScreen } from '../screens/EntryListScreen'
import { TouchableOpacity, Text } from 'react-native'

export type RootStackParamList = {
  Login: undefined
  EntryList: undefined
}
// undefined = the screen takes no params
// or it could look like { userId: string } for example

const Stack = createNativeStackNavigator<RootStackParamList>()
// this creates a stack navigator
// The <RootStackParamList> generic wires in your type —
// so Stack.Screen only accepts screen names that exist in your param list.
// createNativeStackNavigator returns an object with two properties —
// Navigator and Screen.

export function RootNavigator() {
  const { state, signOut } = useAuthStore()

  if (state.status === 'loading') return null

  return (
    // NavigationContainer is the root wrapper
    <NavigationContainer>
      <Stack.Navigator>
        {state.status === 'authenticated' ? (
          <Stack.Screen
            name='EntryList'
            component={EntryListScreen}
            options={{
              title: 'Patterns',
              headerRight: () => (
                <TouchableOpacity onPress={signOut}>
                  <Text>Sign out</Text>
                </TouchableOpacity>
              ),
            }}
          />
        ) : (
          <Stack.Screen
            name='Login'
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
