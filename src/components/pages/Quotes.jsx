import { useState, useEffect } from 'react'
import { quoteService } from '@/services/api/quoteService'
import AddQuoteModal from '@/components/organisms/AddQuoteModal'
import QuoteDetailModal from '@/components/organisms/QuoteDetailModal'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import { toast } from 'react-toastify'
import { formatDistanceToNow } from 'date-fns'

function Quotes() {
  const [quotes, setQuotes] = useState([])
  const [filteredQuotes, setFilteredQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [editingQuote, setEditingQuote] = useState(null)

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      const data = await quoteService.getAll()
      setQuotes(data)
      setFilteredQuotes(data)
    } catch (err) {
      setError('Failed to load quotes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = quotes

    if (searchQuery) {
      filtered = filtered.filter(quote => 
        quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.notes.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(quote => quote.status === statusFilter)
    }

    setFilteredQuotes(filtered)
  }, [quotes, searchQuery, statusFilter])

  function handleSearch(query) {
    setSearchQuery(query)
  }

  function handleAddQuote() {
    setEditingQuote(null)
    setShowAddModal(true)
  }

  function handleEditQuote(quote) {
    setEditingQuote(quote)
    setShowAddModal(true)
  }

  function handleViewQuote(quote) {
    setSelectedQuote(quote)
    setShowDetailModal(true)
  }

  async function handleDeleteQuote(quoteId) {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      try {
        await quoteService.delete(quoteId)
        setQuotes(prev => prev.filter(q => q.Id !== quoteId))
        toast.success('Quote deleted successfully')
      } catch (err) {
        toast.error('Failed to delete quote')
      }
    }
  }

  async function handleSuccess() {
    await loadData()
    setShowAddModal(false)
    setEditingQuote(null)
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  function getStatusBadgeVariant(status) {
    const variants = {
      'Draft': 'secondary',
      'Pending': 'warning',
      'Approved': 'success',
      'Rejected': 'destructive',
      'Expired': 'secondary'
    }
    return variants[status] || 'secondary'
  }

  function getStatusColor(status) {
    const colors = {
      'Draft': 'text-gray-600 bg-gray-100',
      'Pending': 'text-yellow-700 bg-yellow-100',
      'Approved': 'text-green-700 bg-green-100',
      'Rejected': 'text-red-700 bg-red-100',
      'Expired': 'text-gray-600 bg-gray-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-500">Quotes</h1>
          <p className="text-gray-600">Manage your sales quotes and proposals</p>
        </div>
        <Button onClick={handleAddQuote} className="bg-coral-500 hover:bg-coral-600 text-white">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Quote
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search quotes..."
            onSearch={handleSearch}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Draft', 'Pending', 'Approved', 'Rejected', 'Expired'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === status
                  ? 'bg-coral-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quotes</p>
              <p className="text-2xl font-bold text-navy-500">{quotes.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {quotes.filter(q => q.status === 'Pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {quotes.filter(q => q.status === 'Approved').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-navy-500">
                {formatCurrency(quotes.reduce((sum, q) => sum + q.total, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-coral-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-coral-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      {filteredQuotes.length === 0 ? (
        <Empty
          icon="FileText"
          title="No quotes found"
          description="Get started by creating your first quote."
          action={{ label: 'Add Quote', onClick: handleAddQuote }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotes.map((quote) => (
                  <tr key={quote.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-navy-600">{quote.quoteNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quote.customerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(quote.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(quote.validUntil).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewQuote(quote)}
                        >
                          <ApperIcon name="Eye" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditQuote(quote)}
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuote(quote.Id)}
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
      {showAddModal && (
        <AddQuoteModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
          quote={editingQuote}
        />
      )}

      {showDetailModal && selectedQuote && (
        <QuoteDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          quote={selectedQuote}
          onEdit={() => {
            setEditingQuote(selectedQuote)
            setShowDetailModal(false)
            setShowAddModal(true)
          }}
        />
      )}
    </div>
  )
}

export default Quotes