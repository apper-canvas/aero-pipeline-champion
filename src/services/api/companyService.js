import companiesData from '@/services/mockData/companies.json'

// In-memory storage for companies
let companies = [...companiesData]

// Utility function to simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Generate next available ID
const getNextId = () => {
  const maxId = companies.length > 0 ? Math.max(...companies.map(c => c.Id)) : 0
  return maxId + 1
}

// Get all companies
export const getAll = async () => {
  await delay()
  return [...companies] // Return copy to prevent direct mutation
}

// Get company by ID
export const getById = async (id) => {
  await delay()
  const company = companies.find(c => c.Id === parseInt(id))
  if (!company) {
    throw new Error(`Company with ID ${id} not found`)
  }
  return { ...company } // Return copy
}

// Create new company
export const create = async (companyData) => {
  await delay()
  
  // Validate required fields
  if (!companyData.name?.trim()) {
    throw new Error('Company name is required')
  }
  
  const newCompany = {
    Id: getNextId(),
    name: companyData.name.trim(),
    industry: companyData.industry || '',
    website: companyData.website || '',
    phone: companyData.phone || '',
    email: companyData.email || '',
    address: companyData.address || '',
    employees: parseInt(companyData.employees) || 0,
    revenue: parseInt(companyData.revenue) || 0,
    notes: companyData.notes || '',
    createdAt: new Date().toISOString()
  }
  
  companies.push(newCompany)
  return { ...newCompany }
}

// Update existing company
export const update = async (id, companyData) => {
  await delay()
  
  const index = companies.findIndex(c => c.Id === parseInt(id))
  if (index === -1) {
    throw new Error(`Company with ID ${id} not found`)
  }
  
  // Validate required fields
  if (!companyData.name?.trim()) {
    throw new Error('Company name is required')
  }
  
  const updatedCompany = {
    ...companies[index],
    name: companyData.name.trim(),
    industry: companyData.industry || '',
    website: companyData.website || '',
    phone: companyData.phone || '',
    email: companyData.email || '',
    address: companyData.address || '',
    employees: parseInt(companyData.employees) || 0,
    revenue: parseInt(companyData.revenue) || 0,
    notes: companyData.notes || ''
  }
  
  companies[index] = updatedCompany
  return { ...updatedCompany }
}

// Delete company
export const deleteCompany = async (id) => {
  await delay()
  
  const index = companies.findIndex(c => c.Id === parseInt(id))
  if (index === -1) {
    throw new Error(`Company with ID ${id} not found`)
  }
  
  companies.splice(index, 1)
  return { success: true }
}

export const companyService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteCompany
}