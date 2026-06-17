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
import { useVoice } from '../hooks/useVoice'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateEntry'>

export function CreateEntryScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { state, saveEntry } = useCreateEntry()
  const [content, setContent] = useState<string>('')
  const [transcript, setTranscript] = useState<string | null>(null)
  // array deconstructuring

  const { state: voiceState, startListening, stopListening } = useVoice(
    (text) => {
      setContent((prev) => prev ? `${prev} ${text}` : text)
      setTranscript(text)
    },
    'it-IT'
  )

  const handleSave = async () => {
    if (!content.trim()) return
    const success = await saveEntry(content)
    if (success) navigation.goBack()
  }

  const handleVoicePress = () => {
    if (voiceState.status === 'listening') {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <View style={styles.container}>
      {state.status === 'error' && (
        <Text style={styles.error}>{state.message}</Text>
      )}

      {voiceState.status === 'error' && (
        <Text style={styles.error}>{voiceState.message}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Write or speak your entry..."
        value={content}
        onChangeText={setContent}
        multiline
        autoFocus
        textAlignVertical="top"
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.voiceButton,
            voiceState.status === 'listening' && styles.voiceButtonActive,
          ]}
          onPress={handleVoicePress}
        >
          <Text style={styles.voiceButtonText}>
            {voiceState.status === 'listening' ? 'Stop' : 'Speak'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            state.status === 'saving' && styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={state.status === 'saving'}
        >
          {state.status === 'saving' ? (
            <ActivityIndicator testID='saving' color='#fff' />
          ) : (
            <Text style={styles.buttonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
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
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  voiceButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#000',
  },
  voiceButtonText: {
    fontSize: 16,
  },
  button: {
    flex: 1,
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
