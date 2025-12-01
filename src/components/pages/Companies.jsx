import { useState, useEffect } from 'react'
import { companyService } from '@/services/api/companyService'
import AddCompanyModal from '@/components/organisms/AddCompanyModal'
import CompanyDetailModal from '@/components/organisms/CompanyDetailModal'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import { toast } from 'react-toastify'

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [editMode, setEditMode] = useState(false)

  // Load companies
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const companiesData = await companyService.getAll()
      setCompanies(companiesData)
      setFilteredCompanies(companiesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadData()
  }, [])

  // Filter companies
  useEffect(() => {
    let filtered = [...companies]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query) ||
        company.email.toLowerCase().includes(query) ||
        company.phone.includes(query)
      )
    }

    // Industry filter
    if (industryFilter !== 'all') {
      filtered = filtered.filter(company => company.industry === industryFilter)
    }

    setFilteredCompanies(filtered)
  }, [companies, searchQuery, industryFilter])

  // Get unique industries
  const industries = [...new Set(companies.map(company => company.industry))].filter(Boolean)

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  // Handle add company
  const handleAddCompany = () => {
    setSelectedCompany(null)
    setEditMode(false)
    setShowAddModal(true)
  }

  // Handle edit company
  const handleEditCompany = (company) => {
    setSelectedCompany(company)
    setEditMode(true)
    setShowDetailModal(false)
    setShowAddModal(true)
  }

  // Handle view company
  const handleViewCompany = (company) => {
    setSelectedCompany(company)
    setShowDetailModal(true)
  }

  // Handle delete company
  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return
    }

    try {
      await companyService.delete(companyId)
      await loadData()
      toast.success('Company deleted successfully')
      setShowDetailModal(false)
    } catch (err) {
      toast.error(`Failed to delete company: ${err.message}`)
    }
  }

  // Handle success (create/update)
  const handleSuccess = async () => {
    await loadData()
    setShowAddModal(false)
    setSelectedCompany(null)
    setEditMode(false)
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format employees count
  const formatEmployees = (count) => {
    return new Intl.NumberFormat('en-US').format(count)
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-500">Companies</h1>
            <p className="text-gray-600 mt-1">
              Manage your business relationships and accounts
            </p>
          </div>
          <Button onClick={handleAddCompany} className="shrink-0">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search companies..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
          <div className="shrink-0">
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Companies List */}
      {filteredCompanies.length === 0 ? (
        <Empty
          title="No companies found"
          description={
            searchQuery || industryFilter !== 'all'
              ? "Try adjusting your search filters"
              : "Start by adding your first company"
          }
          action={
            <Button onClick={handleAddCompany}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.Id}
              className="bg-white p-6 rounded-lg shadow-card hover:shadow-lifted transition-shadow duration-200 cursor-pointer"
              onClick={() => handleViewCompany(company)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-navy-500 mb-1">
                    {company.name}
                  </h3>
                  {company.industry && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {company.industry}
                    </span>
                  )}
                </div>
                <ApperIcon name="Building2" className="w-5 h-5 text-gray-400 shrink-0 ml-2" />
              </div>

              <div className="space-y-2">
                {company.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Mail" className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">{company.email}</span>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Phone" className="w-4 h-4 mr-2 shrink-0" />
                    <span>{company.phone}</span>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Globe" className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">{company.website}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Employees</span>
                    <div className="font-semibold text-navy-500">
                      {company.employees ? formatEmployees(company.employees) : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Revenue</span>
                    <div className="font-semibold text-navy-500">
                      {company.revenue ? formatCurrency(company.revenue) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddCompanyModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
          company={editMode ? selectedCompany : null}
          editMode={editMode}
        />
      )}

      {showDetailModal && selectedCompany && (
        <CompanyDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          company={selectedCompany}
          onEdit={() => handleEditCompany(selectedCompany)}
          onDelete={() => handleDeleteCompany(selectedCompany.Id)}
        />
      )}
    </div>
  )
}

export default Companies