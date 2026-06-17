import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEntries } from '../hooks/useEntries'
import { Entry } from '../types/database'

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
  const { state, deleteEntry } = useEntries()

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
