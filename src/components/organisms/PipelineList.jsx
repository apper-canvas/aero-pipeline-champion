import { useState, useEffect } from 'react'
import { dealService } from '@/services/api/dealService'
import { stageService } from '@/services/api/stageService'
import { contactService } from '@/services/api/contactService'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'
import { formatDistanceToNow } from 'date-fns'

const PipelineList = ({ onAddDeal, onEditDeal, onViewDeal }) => {
  const [deals, setDeals] = useState([])
  const [stages, setStages] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      setError(null)

      const [dealsResult, stagesResult, contactsResult] = await Promise.allSettled([
        dealService.getAll(),
        stageService.getAll(),
        contactService.getAll()
      ])

      if (dealsResult.status === 'fulfilled') {
        setDeals(dealsResult.value || [])
      } else {
        console.error('Failed to load deals:', dealsResult.reason)
      }

      if (stagesResult.status === 'fulfilled') {
        setStages(stagesResult.value || [])
      } else {
        console.error('Failed to load stages:', stagesResult.reason)
      }

      if (contactsResult.status === 'fulfilled') {
        setContacts(contactsResult.value || [])
      } else {
        console.error('Failed to load contacts:', contactsResult.reason)
      }

    } catch (err) {
      console.error('Error loading pipeline data:', err)
      setError('Failed to load pipeline data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function getContactById(contactId) {
    return contacts.find(contact => contact.Id === contactId)
  }

  function getStageById(stageId) {
    return stages.find(stage => stage.Id === stageId)
  }

  function formatCurrency(amount) {
    if (!amount) return '$0'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  function safeDateFormat(dateValue, fallback = "Unknown") {
    if (!dateValue) return fallback
    try {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return fallback
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return fallback
    }
  }

  function getValueBadgeVariant(value) {
    if (!value || value === 0) return 'secondary'
    if (value < 10000) return 'secondary'
    if (value < 50000) return 'warning'
    return 'success'
  }

  function getPriorityBadgeVariant(priority) {
    switch (priority?.toLowerCase()) {
      case 'high': return 'destructive'
      case 'medium': return 'warning'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} />

  if (!deals?.length) {
    return (
      <Empty
        title="No deals yet"
        description="Get started by adding your first deal to the pipeline."
        action={
          <Button onClick={onAddDeal} className="flex items-center gap-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Deal
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Pipeline Deals ({deals.length})
        </h3>
      </div>

      {/* Table Header */}
      <div className="overflow-x-auto">
<table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deal
              </th>
              <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="w-1/8 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="w-1/10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="w-1/12 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
<tbody className="bg-white divide-y divide-gray-200">
            {deals.map((deal) => {
              const contact = getContactById(deal.contact_id_c)
              const stage = getStageById(deal.stage_id_c)
              
              return (
                <tr key={deal.Id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 w-1/4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 truncate" title={deal.name_c || 'Untitled Deal'}>
                        {deal.name_c || 'Untitled Deal'}
                      </span>
                      {deal.description_c && (
                        <span className="text-xs text-gray-500 mt-1 line-clamp-2 leading-4" title={deal.description_c}>
                          {deal.description_c.length > 80 
                            ? `${deal.description_c.substring(0, 80)}...`
                            : deal.description_c
                          }
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 w-1/5">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-900 truncate" title={contact ? `${contact.first_name_c || ''} ${contact.last_name_c || ''}`.trim() : 'No contact'}>
                        {contact ? `${contact.first_name_c || ''} ${contact.last_name_c || ''}`.trim() || 'No name' : 'No contact'}
                      </span>
                      {contact?.email_c && (
                        <span className="text-xs text-gray-500 truncate" title={contact.email_c}>
                          {contact.email_c}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 w-1/8">
                    <Badge variant="outline" className="inline-flex items-center">
                      {stage?.name_c || 'Unknown'}
                    </Badge>
                  </td>
                  
                  <td className="px-4 py-4 w-1/8">
                    <Badge variant={getValueBadgeVariant(deal.value_c)} className="inline-flex items-center font-medium">
                      {formatCurrency(deal.value_c || 0)}
                    </Badge>
                  </td>
                  
                  <td className="px-4 py-4 w-1/10">
                    <Badge variant={getPriorityBadgeVariant(deal.priority_c)} className="inline-flex items-center">
                      {deal.priority_c || 'Normal'}
                    </Badge>
                  </td>
                  
                  <td className="px-4 py-4 w-1/6 text-sm text-gray-500">
                    <span title={deal.date_modified}>
                      {safeDateFormat(deal.date_modified)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 w-1/12 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDeal(deal)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="View Deal"
                      >
                        <ApperIcon name="Eye" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditDeal(deal)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        title="Edit Deal"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {deals.length}
          </div>
          <div className="text-sm text-gray-500">Total Deals</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(deals.reduce((sum, deal) => sum + (deal.value_c || 0), 0))}
          </div>
          <div className="text-sm text-gray-500">Total Value</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(deals.length > 0 ? deals.reduce((sum, deal) => sum + (deal.value_c || 0), 0) / deals.length : 0)}
          </div>
          <div className="text-sm text-gray-500">Average Value</div>
        </div>
      </div>
    </div>
  )
}

export default PipelineList