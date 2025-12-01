import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { formatDistanceToNow } from 'date-fns'

function QuoteDetailModal({ isOpen, onClose, quote, onEdit }) {
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
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

  if (!isOpen || !quote) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-navy-500">{quote.quoteNumber}</h2>
              <p className="text-sm text-gray-600">{quote.customerName}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                {quote.status}
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quote Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Customer</h3>
                  <p className="text-lg font-medium text-navy-600">{quote.customerName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Quote Number</h3>
                  <p className="text-base font-mono text-gray-900">{quote.quoteNumber}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Valid Until</h3>
                  <p className="text-base text-gray-900">
                    {new Date(quote.validUntil).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                  <p className="text-base text-gray-900">
                    {formatDistanceToNow(new Date(quote.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            {/* Quote Items */}
            <div>
              <h3 className="text-lg font-medium text-navy-500 mb-4">Quote Items</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quote.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm text-gray-900">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm text-gray-900">{formatCurrency(item.unitPrice)}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(item.total)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quote Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-navy-500 mb-4">Quote Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(quote.subtotal)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Tax ({(quote.taxRate * 100).toFixed(2)}%):</span>
                  <span className="font-medium text-gray-900">{formatCurrency(quote.taxAmount)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-xl">
                    <span className="font-medium text-navy-500">Total:</span>
                    <span className="font-bold text-navy-600">{formatCurrency(quote.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {quote.notes && (
              <div>
                <h3 className="text-lg font-medium text-navy-500 mb-3">Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={onEdit}
                className="bg-coral-500 hover:bg-coral-600 text-white"
              >
                <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                Edit Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuoteDetailModal