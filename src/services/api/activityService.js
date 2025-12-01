import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

export const activityService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "deal_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ]
      }

      const response = await apperClient.fetchRecords('activity_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error)
      toast.error("Failed to load activities")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "deal_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ]
      }

      const response = await apperClient.getRecordById('activity_c', parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load activity")
      return null
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "deal_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "contact_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contactId)]
        }],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      }

      const response = await apperClient.fetchRecords('activity_c', params)

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching activities by contact:", error?.response?.data?.message || error)
      return []
    }
  },

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "deal_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "deal_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(dealId)]
        }],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      }

      const response = await apperClient.fetchRecords('activity_c', params)

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.response?.data?.message || error)
      return []
    }
  },

  async create(activityData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      // Filter out empty fields and map to database field names
      const recordData = {}
      if (activityData.name?.trim()) recordData.Name = activityData.name.trim()
      if (activityData.title?.trim()) recordData.title_c = activityData.title.trim()
      if (activityData.description?.trim()) recordData.description_c = activityData.description.trim()
      if (activityData.type?.trim()) recordData.type_c = activityData.type.trim()
      if (activityData.contact_id_c || activityData.contactId) {
        recordData.contact_id_c = parseInt(activityData.contact_id_c || activityData.contactId)
      }
      if (activityData.deal_id_c || activityData.dealId) {
        recordData.deal_id_c = parseInt(activityData.deal_id_c || activityData.dealId)
      }

      const params = {
        records: [recordData]
      }

      const response = await apperClient.createRecord('activity_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error)
      toast.error("Failed to create activity")
      return null
    }
  },

  async update(id, activityData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      // Filter out empty fields and map to database field names
      const recordData = { Id: parseInt(id) }
      if (activityData.name?.trim()) recordData.Name = activityData.name.trim()
      if (activityData.title?.trim()) recordData.title_c = activityData.title.trim()
      if (activityData.description?.trim()) recordData.description_c = activityData.description.trim()
      if (activityData.type?.trim()) recordData.type_c = activityData.type.trim()
      if (activityData.contact_id_c || activityData.contactId) {
        recordData.contact_id_c = parseInt(activityData.contact_id_c || activityData.contactId)
      }
      if (activityData.deal_id_c || activityData.dealId) {
        recordData.deal_id_c = parseInt(activityData.deal_id_c || activityData.dealId)
      }

      const params = {
        records: [recordData]
      }

      const response = await apperClient.updateRecord('activity_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error)
      toast.error("Failed to update activity")
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('activity_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error)
      toast.error("Failed to delete activity")
      return null
    }
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