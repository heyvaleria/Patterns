import { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../navigation/RootNavigator'
import { useCreateEntry } from '../hooks/useCreateEntry'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateEntry'>

export function CreateEntryScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { state, saveEntry } = useCreateEntry()
  const [content, setContent] = useState<string>('')
  // array deconstructuring

  const handleSave = async () => {
    if (!content.trim()) return
    const success = await saveEntry(content)
    if (success) navigation.goBack()
  }

  return (
    <View style={styles.container}>
      {state.status === 'error' && <Text style={styles.error}>{state.message}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Write your entry..."
        value={content}
        onChangeText={setContent}
        multiline
        autoFocus
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.button, state.status === 'saving' && styles.buttonDisabled]}
        // React Native accepts an array of styles — it merges them left to right.
        // The second style only applies when saving. Clean conditional styling
        // without any string manipulation.
        onPress={handleSave}
        disabled={state.status === 'saving'}
      >
        {state.status === 'saving' ? (
          <ActivityIndicator testID="saving" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
})
