import dealsData from '@/services/mockData/deals.json'

let deals = [...dealsData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const dealService = {
  async getAll() {
    await delay()
    return [...deals]
  },

  async getById(id) {
    await delay()
    return deals.find(deal => deal.Id === parseInt(id))
  },

  async getByContactId(contactId) {
    await delay()
    return deals.filter(deal => deal.contactId === parseInt(contactId))
  },

  async getByStage(stage) {
    await delay()
    return deals.filter(deal => deal.stage === stage)
  },

  async create(dealData) {
    await delay()
    const newDeal = {
      Id: Math.max(...deals.map(d => d.Id)) + 1,
      ...dealData,
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString()
    }
    deals.push(newDeal)
    return { ...newDeal }
  },

  async update(id, dealData) {
    await delay()
    const index = deals.findIndex(deal => deal.Id === parseInt(id))
    if (index !== -1) {
      deals[index] = { 
        ...deals[index], 
        ...dealData,
        lastContact: new Date().toISOString()
      }
      return { ...deals[index] }
    }
    return null
  },

  async delete(id) {
    await delay()
    const index = deals.findIndex(deal => deal.Id === parseInt(id))
    if (index !== -1) {
      const deleted = deals.splice(index, 1)[0]
      return deleted
    }
    return null
  },

  async updateStage(id, stage) {
    await delay()
    const index = deals.findIndex(deal => deal.Id === parseInt(id))
    if (index !== -1) {
      deals[index] = { 
        ...deals[index], 
        stage,
        lastContact: new Date().toISOString()
      }
      return { ...deals[index] }
    }
    return null
  }
}