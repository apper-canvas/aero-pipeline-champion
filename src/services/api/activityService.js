import activitiesData from '@/services/mockData/activities.json'

let activities = [...activitiesData]

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))

export const activityService = {
  async getAll() {
    await delay()
    return [...activities]
  },

  async getById(id) {
    await delay()
    return activities.find(activity => activity.Id === parseInt(id))
  },

  async getByContactId(contactId) {
    await delay()
    return activities
      .filter(activity => activity.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async getByDealId(dealId) {
    await delay()
    return activities
      .filter(activity => activity.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async create(activityData) {
    await delay()
    const newActivity = {
      Id: Math.max(...activities.map(a => a.Id)) + 1,
      ...activityData,
      createdAt: new Date().toISOString()
    }
    activities.push(newActivity)
    return { ...newActivity }
  },

  async update(id, activityData) {
    await delay()
    const index = activities.findIndex(activity => activity.Id === parseInt(id))
    if (index !== -1) {
      activities[index] = { ...activities[index], ...activityData }
      return { ...activities[index] }
    }
    return null
  },

  async delete(id) {
    await delay()
    const index = activities.findIndex(activity => activity.Id === parseInt(id))
    if (index !== -1) {
      const deleted = activities.splice(index, 1)[0]
      return deleted
    }
    return null
  },

  getActivityTypeIcon(type) {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Users",
      note: "MessageSquare",
      task: "CheckSquare",
      other: "Activity"
    }
    return icons[type] || "Activity"
  },

  getActivityTypeColor(type) {
    const colors = {
      call: "from-blue-500 to-blue-600",
      email: "from-green-500 to-green-600",
      meeting: "from-purple-500 to-purple-600",
      note: "from-orange-500 to-orange-600",
      task: "from-red-500 to-red-600",
      other: "from-gray-500 to-gray-600"
    }
    return colors[type] || "from-gray-500 to-gray-600"
  }
}