export type Entry = {
  id: string
  user_id: string
  content: string
  transcript: string | null  // null = entry was typed, not spoken (union type)
  created_at: string
}

export type NewEntry = Omit<Entry, 'id' | 'created_at'> // utility type
// it derives a new type from an existing one by removing specific keys
// Omit says: "same shape as Entry, but without id and created_at"
// because Supabase generates those — the user never provides them
