import stagesData from '@/services/mockData/stages.json'

let stages = [...stagesData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const stageService = {
  async getAll() {
    await delay()
    return [...stages].sort((a, b) => a.order - b.order)
  },

  async getById(id) {
    await delay()
    return stages.find(stage => stage.Id === parseInt(id))
  },

  async getByName(name) {
    await delay()
    return stages.find(stage => stage.name.toLowerCase() === name.toLowerCase())
  }
}