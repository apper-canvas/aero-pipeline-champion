import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const CompanyDetailModal = ({ isOpen, onClose, company, onEdit, onDelete }) => {
  if (!isOpen || !company) return null

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format employees count
  const formatEmployees = (count) => {
    if (!count) return 'N/A'
    return new Intl.NumberFormat('en-US').format(count)
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lifted max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ApperIcon name="Building2" className="w-6 h-6 text-coral-500" />
            <h2 className="text-xl font-semibold text-navy-500">{company.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy-500 mb-3">Company Information</h3>
              
              {company.industry && (
                <div>
                  <span className="text-sm text-gray-500">Industry</span>
                  <div className="mt-1">
                    <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                      {company.industry}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <span className="text-sm text-gray-500">Created Date</span>
                <div className="mt-1 text-navy-500">{formatDate(company.createdAt)}</div>
              </div>

              <div>
                <span className="text-sm text-gray-500">Employees</span>
                <div className="mt-1 text-navy-500 font-semibold">{formatEmployees(company.employees)}</div>
              </div>

              <div>
                <span className="text-sm text-gray-500">Annual Revenue</span>
                <div className="mt-1 text-navy-500 font-semibold">{formatCurrency(company.revenue)}</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy-500 mb-3">Contact Details</h3>
              
              {company.email && (
                <div className="flex items-center gap-3">
                  <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <div className="text-navy-500">{company.email}</div>
                  </div>
                </div>
              )}

              {company.phone && (
                <div className="flex items-center gap-3">
                  <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Phone</span>
                    <div className="text-navy-500">{company.phone}</div>
                  </div>
                </div>
              )}

              {company.website && (
                <div className="flex items-center gap-3">
                  <ApperIcon name="Globe" className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Website</span>
                    <div className="text-navy-500">
                      <a href={company.website} target="_blank" rel="noopener noreferrer" 
                         className="hover:text-coral-500 transition-colors">
                        {company.website}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {company.address && (
                <div className="flex items-start gap-3">
                  <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <span className="text-sm text-gray-500">Address</span>
                    <div className="text-navy-500">{company.address}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {company.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-navy-500 mb-3">Notes</h3>
              <div className="text-gray-700 bg-gray-50 p-4 rounded-lg">{company.notes}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <Button onClick={onEdit} className="flex-1">
              <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
              Edit Company
            </Button>
            <Button
              variant="outline"
              onClick={onDelete}
              className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
              Delete Company
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailModal