import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

export const dealService = {
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
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "company_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.fetchRecords('deal_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error)
      toast.error("Failed to load deals")
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
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "company_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.getRecordById('deal_c', parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load deal")
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
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "company_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "contact_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contactId)]
        }]
      }

      const response = await apperClient.fetchRecords('deal_c', params)

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching deals by contact:", error?.response?.data?.message || error)
      return []
    }
  },

async getByStage(stage) {
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
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "company_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "stage_c",
          "Operator": "EqualTo",
          "Values": [stage]
        }]
      }

      const response = await apperClient.fetchRecords('deal_c', params)

      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching deals by stage:", error?.response?.data?.message || error)
      return []
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      // Filter out empty fields and map to database field names
      const recordData = {}
      if (dealData.name?.trim()) recordData.Name = dealData.name.trim()
      if (dealData.title?.trim()) recordData.title_c = dealData.title.trim()
      if (dealData.value !== undefined && dealData.value !== '') recordData.value_c = parseFloat(dealData.value) || 0
      if (dealData.stage?.trim()) recordData.stage_c = dealData.stage.trim()
      if (dealData.notes?.trim()) recordData.notes_c = dealData.notes.trim()
      if (dealData.contact_id_c || dealData.contactId) {
        recordData.contact_id_c = parseInt(dealData.contact_id_c || dealData.contactId)
      }

      const params = {
        records: [recordData]
      }

      const response = await apperClient.createRecord('deal_c', params)

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
      console.error("Error creating deal:", error?.response?.data?.message || error)
      toast.error("Failed to create deal")
      return null
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      // Filter out empty fields and map to database field names
      const recordData = { Id: parseInt(id) }
      if (dealData.name?.trim()) recordData.Name = dealData.name.trim()
      if (dealData.title?.trim()) recordData.title_c = dealData.title.trim()
      if (dealData.value !== undefined && dealData.value !== '') recordData.value_c = parseFloat(dealData.value) || 0
      if (dealData.stage?.trim()) recordData.stage_c = dealData.stage.trim()
      if (dealData.notes?.trim()) recordData.notes_c = dealData.notes.trim()
      if (dealData.contact_id_c || dealData.contactId) {
        recordData.contact_id_c = parseInt(dealData.contact_id_c || dealData.contactId)
      }

      const params = {
        records: [recordData]
      }

      const response = await apperClient.updateRecord('deal_c', params)

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
      console.error("Error updating deal:", error?.response?.data?.message || error)
      toast.error("Failed to update deal")
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

      const response = await apperClient.deleteRecord('deal_c', params)

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
      console.error("Error deleting deal:", error?.response?.data?.message || error)
      toast.error("Failed to delete deal")
      return null
    }
  },

  async updateStage(id, stage) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const recordData = { 
        Id: parseInt(id),
        stage_c: stage
      }

      const params = {
        records: [recordData]
      }

      const response = await apperClient.updateRecord('deal_c', params)

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
      console.error("Error updating deal stage:", error?.response?.data?.message || error)
      toast.error("Failed to update deal stage")
      return null
    }
  }
}