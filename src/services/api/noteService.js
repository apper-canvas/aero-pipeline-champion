import notesData from '@/services/mockData/notes.json'

let notes = [...notesData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const noteService = {
  async getAll() {
    await delay()
    return [...notes]
  },

  async getById(id) {
    await delay()
    return notes.find(note => note.Id === parseInt(id))
  },

  async getByDealId(dealId) {
    await delay()
    return notes
      .filter(note => note.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async create(noteData) {
    await delay()
    const newNote = {
      Id: Math.max(...notes.map(n => n.Id)) + 1,
      ...noteData,
      createdAt: new Date().toISOString()
    }
    notes.push(newNote)
    return { ...newNote }
  },

  async update(id, noteData) {
    await delay()
    const index = notes.findIndex(note => note.Id === parseInt(id))
    if (index !== -1) {
      notes[index] = { ...notes[index], ...noteData }
      return { ...notes[index] }
    }
    return null
  },

  async delete(id) {
    await delay()
    const index = notes.findIndex(note => note.Id === parseInt(id))
    if (index !== -1) {
      const deleted = notes.splice(index, 1)[0]
      return deleted
    }
    return null
  }
}