import type { Entry, NewEntry } from '../types/database'

describe('Entry types', () => {
  it('accepts a valid entry', () => {
    const entry: Entry = {
      id: '123',
      user_id: 'abc',
      content: 'Today was a good day',
      transcript: null,
      created_at: '2026-01-01T00:00:00Z',
    }
    expect(entry.content).toBe('Today was a good day')
  })

  it('accepts a voice entry with transcript', () => {
    const entry: Entry = {
      id: '124',
      user_id: 'abc',
      content: 'Voice note',
      transcript: 'This is what I said out loud',
      created_at: '2026-01-01T00:00:00Z',
    }
    expect(entry.transcript).not.toBeNull()
  })

  it('NewEntry does not have id or created_at', () => {
    const newEntry: NewEntry = {
      user_id: 'abc',
      content: 'New entry',
      transcript: null,
    }
    expect(newEntry.content).toBe('New entry')
  })
})
