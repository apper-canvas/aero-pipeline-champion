import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

export const stageService = {
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
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}}
        ],
        orderBy: [{
          "fieldName": "order_c",
          "sorttype": "ASC"
        }]
      }

      const response = await apperClient.fetchRecords('stage_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching stages:", error?.response?.data?.message || error)
      toast.error("Failed to load stages")
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
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}}
        ]
      }

      const response = await apperClient.getRecordById('stage_c', parseInt(id), params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching stage ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load stage")
      return null
    }
  },

  async getByName(name) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}}
        ],
        where: [{
          "FieldName": "Name",
          "Operator": "EqualTo",
          "Values": [name]
        }]
      }

      const response = await apperClient.fetchRecords('stage_c', params)

      if (!response.success) {
        console.error(response.message)
        return null
      }

      const data = response.data || []
      return data.length > 0 ? data[0] : null
    } catch (error) {
      console.error("Error fetching stage by name:", error?.response?.data?.message || error)
      return null
    }
  }
}