import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

function generateQuoteNumber() {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `QUO-${year}-${timestamp}`
}

export async function getAll() {
  try {
    const apperClient = getApperClient()
    if (!apperClient) {
      throw new Error("ApperClient not initialized")
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "quote_number_c"}},
        {"field": {"Name": "customer_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
        {"field": {"Name": "customer_name_c"}},
        {"field": {"Name": "items_c"}},
        {"field": {"Name": "notes_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "subtotal_c"}},
        {"field": {"Name": "tax_amount_c"}},
        {"field": {"Name": "tax_rate_c"}},
        {"field": {"Name": "total_c"}},
        {"field": {"Name": "valid_until_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    }

    const response = await apperClient.fetchRecords('quote_c', params)

    if (!response.success) {
      console.error(response.message)
      toast.error(response.message)
      return []
    }

    return response.data || []
  } catch (error) {
    console.error("Error fetching quotes:", error?.response?.data?.message || error)
    toast.error("Failed to load quotes")
    return []
  }
}

export async function getById(id) {
  try {
    const apperClient = getApperClient()
    if (!apperClient) {
      throw new Error("ApperClient not initialized")
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "quote_number_c"}},
        {"field": {"Name": "customer_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
        {"field": {"Name": "customer_name_c"}},
        {"field": {"Name": "items_c"}},
        {"field": {"Name": "notes_c"}},
        {"field": {"Name": "status_c"}},
        {"field": {"Name": "subtotal_c"}},
        {"field": {"Name": "tax_amount_c"}},
        {"field": {"Name": "tax_rate_c"}},
        {"field": {"Name": "total_c"}},
        {"field": {"Name": "valid_until_c"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "ModifiedOn"}}
      ]
    }

    const response = await apperClient.getRecordById('quote_c', parseInt(id), params)

    if (!response.success) {
      console.error(response.message)
      toast.error(response.message)
      return null
    }

    return response.data
  } catch (error) {
    console.error(`Error fetching quote ${id}:`, error?.response?.data?.message || error)
    toast.error("Failed to load quote")
    return null
  }
}

export async function create(quoteData) {
  try {
    const apperClient = getApperClient()
    if (!apperClient) {
      throw new Error("ApperClient not initialized")
    }

    // Filter out empty fields and map to database field names
    const recordData = {}
    if (quoteData.name?.trim()) recordData.Name = quoteData.name.trim()
    
    recordData.quote_number_c = generateQuoteNumber()
    
    if (quoteData.customer_id_c || quoteData.customerId) {
      recordData.customer_id_c = parseInt(quoteData.customer_id_c || quoteData.customerId)
    }
    if (quoteData.customer_name_c || quoteData.customerName?.trim()) {
      recordData.customer_name_c = quoteData.customer_name_c || quoteData.customerName.trim()
    }
    if (quoteData.items_c || quoteData.items) {
      recordData.items_c = typeof (quoteData.items_c || quoteData.items) === 'string' 
        ? quoteData.items_c || quoteData.items 
        : JSON.stringify(quoteData.items_c || quoteData.items)
    }
    if (quoteData.notes?.trim()) recordData.notes_c = quoteData.notes.trim()
    if (quoteData.status?.trim()) recordData.status_c = quoteData.status.trim()
    if (quoteData.subtotal !== undefined && quoteData.subtotal !== '') recordData.subtotal_c = parseFloat(quoteData.subtotal) || 0
    if (quoteData.tax_amount !== undefined && quoteData.tax_amount !== '') recordData.tax_amount_c = parseFloat(quoteData.tax_amount) || 0
    if (quoteData.tax_rate !== undefined && quoteData.tax_rate !== '') recordData.tax_rate_c = parseFloat(quoteData.tax_rate) || 0
    if (quoteData.total !== undefined && quoteData.total !== '') recordData.total_c = parseFloat(quoteData.total) || 0
    if (quoteData.valid_until_c || quoteData.validUntil) recordData.valid_until_c = quoteData.valid_until_c || quoteData.validUntil

    const params = {
      records: [recordData]
    }

    const response = await apperClient.createRecord('quote_c', params)

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
    console.error("Error creating quote:", error?.response?.data?.message || error)
    toast.error("Failed to create quote")
    return null
  }
}

export async function update(id, quoteData) {
  try {
    const apperClient = getApperClient()
    if (!apperClient) {
      throw new Error("ApperClient not initialized")
    }

    // Filter out empty fields and map to database field names
    const recordData = { Id: parseInt(id) }
    if (quoteData.name?.trim()) recordData.Name = quoteData.name.trim()
    if (quoteData.quote_number_c?.trim()) recordData.quote_number_c = quoteData.quote_number_c.trim()
    if (quoteData.customer_id_c || quoteData.customerId) {
      recordData.customer_id_c = parseInt(quoteData.customer_id_c || quoteData.customerId)
    }
    if (quoteData.customer_name_c || quoteData.customerName?.trim()) {
      recordData.customer_name_c = quoteData.customer_name_c || quoteData.customerName.trim()
    }
    if (quoteData.items_c || quoteData.items) {
      recordData.items_c = typeof (quoteData.items_c || quoteData.items) === 'string' 
        ? quoteData.items_c || quoteData.items 
        : JSON.stringify(quoteData.items_c || quoteData.items)
    }
    if (quoteData.notes?.trim()) recordData.notes_c = quoteData.notes.trim()
    if (quoteData.status?.trim()) recordData.status_c = quoteData.status.trim()
    if (quoteData.subtotal !== undefined && quoteData.subtotal !== '') recordData.subtotal_c = parseFloat(quoteData.subtotal) || 0
    if (quoteData.tax_amount !== undefined && quoteData.tax_amount !== '') recordData.tax_amount_c = parseFloat(quoteData.tax_amount) || 0
    if (quoteData.tax_rate !== undefined && quoteData.tax_rate !== '') recordData.tax_rate_c = parseFloat(quoteData.tax_rate) || 0
    if (quoteData.total !== undefined && quoteData.total !== '') recordData.total_c = parseFloat(quoteData.total) || 0
    if (quoteData.valid_until_c || quoteData.validUntil) recordData.valid_until_c = quoteData.valid_until_c || quoteData.validUntil

    const params = {
      records: [recordData]
    }

    const response = await apperClient.updateRecord('quote_c', params)

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
    console.error("Error updating quote:", error?.response?.data?.message || error)
    toast.error("Failed to update quote")
    return null
  }
}

export async function deleteQuote(id) {
  try {
    const apperClient = getApperClient()
    if (!apperClient) {
      throw new Error("ApperClient not initialized")
    }

    const params = {
      RecordIds: [parseInt(id)]
    }

    const response = await apperClient.deleteRecord('quote_c', params)

    if (!response.success) {
      console.error(response.message)
      toast.error(response.message)
      return false
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
      
      return successful.length === 1
    }

    return false
  } catch (error) {
    console.error("Error deleting quote:", error?.response?.data?.message || error)
    toast.error("Failed to delete quote")
    return false
  }
}

export const quoteService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteQuote
}