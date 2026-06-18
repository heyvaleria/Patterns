import { useEffect } from 'react'
import { useCallback } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useEntries } from '../hooks/useEntries'
import { RootStackParamList } from '../navigation/RootNavigator'
import { Entry } from '../types/database'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EntryList'>

type EntryCardProps = {
  entry: Entry
  onDelete: (id: string) => void
}

function EntryCard({ entry, onDelete }: EntryCardProps) {
  const date = new Date(entry.created_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <View style={styles.card}>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.content} numberOfLines={3}>
        {entry.content}
      </Text>
      {entry.transcript && <Text style={styles.transcript}>Voice entry</Text>}
      <TouchableOpacity onPress={() => onDelete(entry.id)}>
        <Text style={styles.delete}>Delete</Text>
      </TouchableOpacity>
    </View>
  )
}

export function EntryListScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { state, deleteEntry, fetchEntries } = useEntries()

  // when I added a new entry, I could not see it in the list, because of stale data.
  // So I am adding useFocusEffect
  // useFocusEffect runs every time the screen comes into focus — including
  // when you navigate back to it. So after saving an entry and returning,
  // it automatically refetches.
  // useCallback is required by useFocusEffect — it memoizes the function
  // so it doesn't recreate it on every render. The empty [] means it never changes.

  // We use useFocusEffect because it runs every time the screen comes into focus
  // including when we navigate back to it from another screen.
  // The useCallback wrapper is required by useFocusEffect to prevent an infinite loop

  // While if we used:
  // useEffect(() => {
  //     fetchEntries()
  // }, [])
  // It would run once, when the component first mounts.
  // If you navigate away and come back, it does not run again.
  // The component is still mounted in memory, just not visible.
  useFocusEffect(
    useCallback(() => {
      fetchEntries()
    }, [])
  )

  // navigation.setOptions lets you configure the header from inside the screen
  // component. It's like saying "hey navigator, update the header with these settings."
  // We need navigation to be available before we can call setOptions.
  // By the time useEffect runs, the component has mounted and navigation is ready.
  // If you tried to call setOptions directly in the render body it would
  // work most of the time, but it's a side effect — it reaches outside
  // the component to change something (the header).
  // React wants side effects in useEffect.
  // Why not in the RootNavigator?
  // But then the + button has no access to navigation — it's defined outside
  // the screen. You can't call navigation.navigate('CreateEntry') from there easily.
  // By setting it inside the screen via useEffect, the button closes over the
  // navigation object and can use it directly.
  useEffect(() => {
    navigation.setOptions({
      // headerRight is a function that returns a component, not a component directly
      // that's what React Navigation expects
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('CreateEntry')}>
          <Text style={{ fontSize: 28 }}>+</Text>
        </TouchableOpacity>
      ),
    })
  }, [navigation])
  // the [navigation] dependency array
  // This tells React: "re-run this effect if navigation changes." In practice
  // navigation never changes, so this runs exactly once when the screen mounts.
  // But including it is correct and keeps ESLint happy.

  if (state.status === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator testID="loading" />
      </View>
    )
  }

  if (state.status === 'error') {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{state.message}</Text>
      </View>
    )
  }

  if (state.entries.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.empty}>No entries yet. Start writing!</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={state.entries}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <EntryCard entry={item} onDelete={deleteEntry} />}
    />
  )
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  transcript: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  delete: {
    fontSize: 14,
    color: 'red',
  },
  error: {
    color: 'red',
  },
  empty: {
    color: '#999',
    fontSize: 16,
  },
})
