import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

export const leadService = {
  async getAll() {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('leads_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching leads:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.getRecordById('leads_c', id, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(leadData) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        records: [{
          Name: leadData.Name,
          first_name_c: leadData.first_name_c,
          last_name_c: leadData.last_name_c,
          email_c: leadData.email_c,
          phone_c: leadData.phone_c,
          company_c: leadData.company_c,
          status_c: leadData.status_c,
          source_c: leadData.source_c,
          notes_c: leadData.notes_c,
          address_c: leadData.address_c
        }]
      }

      const response = await apperClient.createRecord('leads_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} leads: ${failed}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error creating lead:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, leadData) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        records: [{
          Id: id,
          Name: leadData.Name,
          first_name_c: leadData.first_name_c,
          last_name_c: leadData.last_name_c,
          email_c: leadData.email_c,
          phone_c: leadData.phone_c,
          company_c: leadData.company_c,
          status_c: leadData.status_c,
          source_c: leadData.source_c,
          notes_c: leadData.notes_c,
          address_c: leadData.address_c
        }]
      }

      const response = await apperClient.updateRecord('leads_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} leads: ${failed}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return successful[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error updating lead:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = { RecordIds: [id] }
      const response = await apperClient.deleteRecord('leads_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} leads: ${failed}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successful.length === 1
      }

      return false
    } catch (error) {
      console.error("Error deleting lead:", error?.response?.data?.message || error)
      return false
    }
  }
}