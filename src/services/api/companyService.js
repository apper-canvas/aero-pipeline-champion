import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

// Get all companies
export const getAll = async () => {
  try {
    const apperClient = getApperClient()
    if (!apperClient) {
      throw new Error("ApperClient not initialized")
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "industry_c"}},
        {"field": {"Name": "website_c"}},
        {"field": {"Name": "phone_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "address_c"}},
        {"field": {"Name": "employees_c"}},
        {"field": {"Name": "revenue_c"}},
        {"field": {"Name": "notes_c"}},
        {"field": {"Name": "CreatedOn"}}
      ]
    }

    const response = await apperClient.fetchRecords('company_c', params)

    if (!response.success) {
      console.error(response.message)
      toast.error(response.message)
      return []
    }

    return response.data || []
  } catch (error) {
    console.error("Error fetching companies:", error?.response?.data?.message || error)
    toast.error("Failed to load companies")
    return []
  }
}

export const getById = async (id) => {
  try {
    const apperClient = getApperClient()
    if (!apperClient) {
      throw new Error("ApperClient not initialized")
    }

    const params = {
      fields: [
        {"field": {"Name": "Id"}},
        {"field": {"Name": "Name"}},
        {"field": {"Name": "industry_c"}},
        {"field": {"Name": "website_c"}},
        {"field": {"Name": "phone_c"}},
        {"field": {"Name": "email_c"}},
        {"field": {"Name": "address_c"}},
        {"field": {"Name": "employees_c"}},
        {"field": {"Name": "revenue_c"}},
        {"field": {"Name": "notes_c"}},
        {"field": {"Name": "CreatedOn"}}
      ]
    }

    const response = await apperClient.getRecordById('company_c', parseInt(id), params)

    if (!response.success) {
      console.error(response.message)
      toast.error(response.message)
      return null
    }

    return response.data
  } catch (error) {
    console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error)
    toast.error("Failed to load company")
    return null
  }
}

export const create = async (companyData) => {
  try {
    const apperClient = getApperClient()
    if (!apperClient) {
      throw new Error("ApperClient not initialized")
    }

    // Filter out empty fields and map to database field names
    const recordData = {}
    if (companyData.name?.trim()) recordData.Name = companyData.name.trim()
    if (companyData.industry?.trim()) recordData.industry_c = companyData.industry.trim()
    if (companyData.website?.trim()) recordData.website_c = companyData.website.trim()
    if (companyData.phone?.trim()) recordData.phone_c = companyData.phone.trim()
    if (companyData.email?.trim()) recordData.email_c = companyData.email.trim()
    if (companyData.address?.trim()) recordData.address_c = companyData.address.trim()
    if (companyData.employees !== undefined && companyData.employees !== '') recordData.employees_c = parseInt(companyData.employees) || 0
    if (companyData.revenue !== undefined && companyData.revenue !== '') recordData.revenue_c = parseFloat(companyData.revenue) || 0
    if (companyData.notes?.trim()) recordData.notes_c = companyData.notes.trim()

    const params = {
      records: [recordData]
    }

    const response = await apperClient.createRecord('company_c', params)

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
    console.error("Error creating company:", error?.response?.data?.message || error)
    toast.error("Failed to create company")
    return null
  }
}

export const update = async (id, companyData) => {
  try {
    const apperClient = getApperClient()
    if (!apperClient) {
      throw new Error("ApperClient not initialized")
    }

    // Filter out empty fields and map to database field names
    const recordData = { Id: parseInt(id) }
    if (companyData.name?.trim()) recordData.Name = companyData.name.trim()
    if (companyData.industry?.trim()) recordData.industry_c = companyData.industry.trim()
    if (companyData.website?.trim()) recordData.website_c = companyData.website.trim()
    if (companyData.phone?.trim()) recordData.phone_c = companyData.phone.trim()
    if (companyData.email?.trim()) recordData.email_c = companyData.email.trim()
    if (companyData.address?.trim()) recordData.address_c = companyData.address.trim()
    if (companyData.employees !== undefined && companyData.employees !== '') recordData.employees_c = parseInt(companyData.employees) || 0
    if (companyData.revenue !== undefined && companyData.revenue !== '') recordData.revenue_c = parseFloat(companyData.revenue) || 0
    if (companyData.notes?.trim()) recordData.notes_c = companyData.notes.trim()

    const params = {
      records: [recordData]
    }

    const response = await apperClient.updateRecord('company_c', params)

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
    console.error("Error updating company:", error?.response?.data?.message || error)
    toast.error("Failed to update company")
    return null
  }
}

export const deleteCompany = async (id) => {
  try {
    const apperClient = getApperClient()
    if (!apperClient) {
      throw new Error("ApperClient not initialized")
    }

    const params = {
      RecordIds: [parseInt(id)]
    }

    const response = await apperClient.deleteRecord('company_c', params)

    if (!response.success) {
      console.error(response.message)
      toast.error(response.message)
      return { success: false }
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
      
      return { success: successful.length === 1 }
    }

    return { success: false }
  } catch (error) {
    console.error("Error deleting company:", error?.response?.data?.message || error)
    toast.error("Failed to delete company")
    return { success: false }
  }
}

export const companyService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteCompany
}