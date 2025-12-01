import { useState, useEffect } from 'react'
import { leadService } from '@/services/api/leadService'
import AddLeadModal from '@/components/organisms/AddLeadModal'
import LeadDetailModal from '@/components/organisms/LeadDetailModal'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import { toast } from 'react-toastify'
import { formatDistanceToNow } from 'date-fns'

const Leads = () => {
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sourceFilter, setSourceFilter] = useState("")
  const [sortField, setSortField] = useState("CreatedOn")
  const [sortDirection, setSortDirection] = useState("desc")

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [editLead, setEditLead] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterLeads()
  }, [leads, searchQuery, statusFilter, sourceFilter, sortField, sortDirection])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const leadsData = await leadService.getAll()
      setLeads(leadsData)
    } catch (err) {
      setError("Failed to load leads")
    } finally {
      setLoading(false)
    }
  }

  const filterLeads = () => {
    let filtered = [...leads]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(lead => 
        (lead.Name && lead.Name.toLowerCase().includes(query)) ||
        (lead.first_name_c && lead.first_name_c.toLowerCase().includes(query)) ||
        (lead.last_name_c && lead.last_name_c.toLowerCase().includes(query)) ||
        (lead.email_c && lead.email_c.toLowerCase().includes(query)) ||
        (lead.company_c && lead.company_c.toLowerCase().includes(query)) ||
        (lead.phone_c && lead.phone_c.toLowerCase().includes(query))
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(lead => lead.status_c === statusFilter)
    }

    // Source filter
    if (sourceFilter) {
      filtered = filtered.filter(lead => lead.source_c === sourceFilter)
    }

    // Sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField] || ""
      const bValue = b[sortField] || ""
      
      if (sortField === "CreatedOn" || sortField === "ModifiedOn") {
        const aDate = new Date(aValue)
        const bDate = new Date(bValue)
        return sortDirection === "desc" ? bDate - aDate : aDate - bDate
      }
      
      const comparison = aValue.toString().localeCompare(bValue.toString())
      return sortDirection === "desc" ? -comparison : comparison
    })

    setFilteredLeads(filtered)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleAddLead = () => {
    setEditLead(null)
    setIsAddModalOpen(true)
  }

  const handleEditLead = (lead) => {
    setEditLead(lead)
    setIsAddModalOpen(true)
    setIsDetailModalOpen(false)
  }

  const handleViewLead = (lead) => {
    setSelectedLead(lead)
    setIsDetailModalOpen(true)
  }

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return

    try {
      const success = await leadService.delete(leadId)
      if (success) {
        toast.success("Lead deleted successfully!")
        loadData()
        setIsDetailModalOpen(false)
      }
    } catch (err) {
      toast.error("Failed to delete lead")
    }
  }

  const handleSuccess = () => {
    loadData()
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusBadgeVariant = (status) => {
    const variants = {
      New: "default",
      Contacted: "primary",
      Qualified: "secondary", 
      Lost: "danger",
      Converted: "success"
    }
    return variants[status] || "default"
  }

  const getSourceBadgeVariant = (source) => {
    const variants = {
      Web: "primary",
      Referral: "success",
      "Trade Show": "secondary",
      Advertisement: "warning"
    }
    return variants[source] || "default"
  }

  const safeDateFormat = (dateValue, fallback = "Unknown") => {
    if (!dateValue) return fallback
    try {
      return formatDistanceToNow(new Date(dateValue), { addSuffix: true })
    } catch {
      return fallback
    }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-gray-400" />
    }
    return sortDirection === "asc" 
      ? <ApperIcon name="ArrowUp" className="w-4 h-4 text-blue-500" />
      : <ApperIcon name="ArrowDown" className="w-4 h-4 text-blue-500" />
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600 mt-1">Manage your sales leads and prospects</p>
          </div>
          <Button onClick={handleAddLead} className="flex items-center gap-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Lead
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search leads..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
            <option value="Converted">Converted</option>
          </Select>

          <Select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-40"
          >
            <option value="">All Sources</option>
            <option value="Web">Web</option>
            <option value="Referral">Referral</option>
            <option value="Trade Show">Trade Show</option>
            <option value="Advertisement">Advertisement</option>
          </Select>
        </div>
      </div>

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <Empty
          title="No leads found"
          description={searchQuery || statusFilter || sourceFilter 
            ? "Try adjusting your search or filters" 
            : "Create your first lead to get started"}
          action={
            !searchQuery && !statusFilter && !sourceFilter ? (
              <Button onClick={handleAddLead} className="flex items-center gap-2">
                <ApperIcon name="Plus" className="w-4 h-4" />
                Add First Lead
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("Name")}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      <SortIcon field="Name" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("company_c")}
                  >
                    <div className="flex items-center gap-1">
                      Company
                      <SortIcon field="company_c" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("status_c")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <SortIcon field="status_c" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("source_c")}
                  >
                    <div className="flex items-center gap-1">
                      Source
                      <SortIcon field="source_c" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("CreatedOn")}
                  >
                    <div className="flex items-center gap-1">
                      Created
                      <SortIcon field="CreatedOn" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {lead.Name || `${lead.first_name_c || ""} ${lead.last_name_c || ""}`.trim() || "Unnamed Lead"}
                        </div>
                        <div className="text-sm text-gray-500">ID: {lead.Id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email_c || "No email"}</div>
                      <div className="text-sm text-gray-500">{lead.phone_c || "No phone"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.company_c || "No company"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusBadgeVariant(lead.status_c)}>
                        {lead.status_c || "No Status"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.source_c ? (
                        <Badge variant={getSourceBadgeVariant(lead.source_c)}>
                          {lead.source_c}
                        </Badge>
                      ) : (
                        <span className="text-sm text-gray-500">No source</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {safeDateFormat(lead.CreatedOn)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewLead(lead)}
                        >
                          <ApperIcon name="Eye" className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditLead(lead)}
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteLead(lead.Id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleSuccess}
        editLead={editLead}
      />

      <LeadDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        lead={selectedLead}
        onEdit={handleEditLead}
        onDelete={handleDeleteLead}
      />
    </div>
  )
}

export default Leads