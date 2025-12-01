import contactsData from '@/services/mockData/contacts.json'

let contacts = [...contactsData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const contactService = {
  async getAll() {
    await delay()
    return [...contacts]
  },

  async getById(id) {
    await delay()
    return contacts.find(contact => contact.Id === parseInt(id))
  },

  async create(contactData) {
    await delay()
    const newContact = {
      Id: Math.max(...contacts.map(c => c.Id)) + 1,
      ...contactData,
      createdAt: new Date().toISOString()
    }
    contacts.push(newContact)
    return { ...newContact }
  },

  async update(id, contactData) {
    await delay()
    const index = contacts.findIndex(contact => contact.Id === parseInt(id))
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...contactData }
      return { ...contacts[index] }
    }
    return null
  },

  async delete(id) {
    await delay()
    const index = contacts.findIndex(contact => contact.Id === parseInt(id))
    if (index !== -1) {
      const deleted = contacts.splice(index, 1)[0]
      return deleted
    }
    return null
  },

  async search(query) {
    await delay()
    const lowercaseQuery = query.toLowerCase()
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(lowercaseQuery) ||
      contact.company.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery)
    )
  }
}