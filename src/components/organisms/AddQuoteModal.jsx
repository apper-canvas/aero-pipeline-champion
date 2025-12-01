import { useState, useEffect } from 'react'
import { quoteService } from '@/services/api/quoteService'
import { companyService } from '@/services/api/companyService'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

function AddQuoteModal({ isOpen, onClose, onSuccess, quote = null }) {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    status: 'Draft',
    items: [{ id: 1, description: '', quantity: 1, unitPrice: 0, total: 0 }],
    subtotal: 0,
    taxRate: 0.08,
    taxAmount: 0,
    total: 0,
    validUntil: '',
    notes: ''
  })
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingCompanies, setLoadingCompanies] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadCompanies()
      
      if (quote) {
        setFormData({
          customerId: quote.customerId,
          customerName: quote.customerName,
          status: quote.status,
          items: quote.items,
          subtotal: quote.subtotal,
          taxRate: quote.taxRate,
          taxAmount: quote.taxAmount,
          total: quote.total,
          validUntil: quote.validUntil.split('T')[0], // Format for date input
          notes: quote.notes
        })
      } else {
        // Set default valid until date (30 days from now)
        const defaultValidUntil = new Date()
        defaultValidUntil.setDate(defaultValidUntil.getDate() + 30)
        setFormData(prev => ({
          ...prev,
          validUntil: defaultValidUntil.toISOString().split('T')[0]
        }))
      }
    }
  }, [isOpen, quote])

  async function loadCompanies() {
    try {
      setLoadingCompanies(true)
      const data = await companyService.getAll()
      setCompanies(data)
    } catch (err) {
      toast.error('Failed to load companies')
    } finally {
      setLoadingCompanies(false)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      
      if (name === 'customerId') {
        const company = companies.find(c => c.Id === parseInt(value))
        newData.customerName = company ? company.name : ''
      }
      
      if (name === 'taxRate') {
        newData.taxRate = parseFloat(value) || 0
        newData.taxAmount = newData.subtotal * newData.taxRate
        newData.total = newData.subtotal + newData.taxAmount
      }
      
      return newData
    })
  }

  function handleItemChange(index, field, value) {
    setFormData(prev => {
      const newItems = [...prev.items]
      newItems[index] = { ...newItems[index], [field]: value }
      
      if (field === 'quantity' || field === 'unitPrice') {
        const quantity = field === 'quantity' ? parseFloat(value) || 0 : newItems[index].quantity
        const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : newItems[index].unitPrice
        newItems[index].total = quantity * unitPrice
      }
      
      const subtotal = newItems.reduce((sum, item) => sum + item.total, 0)
      const taxAmount = subtotal * prev.taxRate
      const total = subtotal + taxAmount
      
      return {
        ...prev,
        items: newItems,
        subtotal,
        taxAmount,
        total
      }
    })
  }

  function addItem() {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: Math.max(...prev.items.map(i => i.id)) + 1,
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }]
    }))
  }

  function removeItem(index) {
    if (formData.items.length > 1) {
      setFormData(prev => {
        const newItems = prev.items.filter((_, i) => i !== index)
        const subtotal = newItems.reduce((sum, item) => sum + item.total, 0)
        const taxAmount = subtotal * prev.taxRate
        const total = subtotal + taxAmount
        
        return {
          ...prev,
          items: newItems,
          subtotal,
          taxAmount,
          total
        }
      })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!formData.customerId || !formData.customerName) {
      toast.error('Please select a customer')
      return
    }
    
    if (formData.items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error('Please complete all quote items')
      return
    }

    setLoading(true)
    
    try {
      const quoteData = {
        ...formData,
        customerId: parseInt(formData.customerId)
      }
      
      if (quote) {
        await quoteService.update(quote.Id, quoteData)
        toast.success('Quote updated successfully!')
      } else {
        await quoteService.create(quoteData)
        toast.success('Quote created successfully!')
      }
      
      onSuccess()
    } catch (err) {
      toast.error(quote ? 'Failed to update quote' : 'Failed to create quote')
    } finally {
      setLoading(false)
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-navy-500">
              {quote ? 'Edit Quote' : 'Create New Quote'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Customer"
                type="select"
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
                disabled={loadingCompanies}
                options={[
                  { value: '', label: 'Select Customer...' },
                  ...companies.map(company => ({ 
                    value: company.Id, 
                    label: company.name 
                  }))
                ]}
              />
              
              <FormField
                label="Status"
                type="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                options={[
                  { value: 'Draft', label: 'Draft' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Rejected', label: 'Rejected' }
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Valid Until"
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                required
              />
              
              <FormField
                label="Tax Rate (%)"
                type="number"
                name="taxRate"
                value={formData.taxRate * 100}
                onChange={(e) => handleChange({ target: { name: 'taxRate', value: e.target.value / 100 } })}
                step="0.01"
                min="0"
                max="100"
              />
            </div>

            {/* Quote Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium text-navy-500">Quote Items</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <Input
                          id={`description-${index}`}
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          placeholder="Service or product description"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`unitPrice-${index}`}>Unit Price</Label>
                        <Input
                          id={`unitPrice-${index}`}
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 text-right">
                      <span className="text-sm text-gray-600">Total: </span>
                      <span className="font-medium text-navy-600">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(formData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({(formData.taxRate * 100).toFixed(2)}%):</span>
                  <span className="font-medium">{formatCurrency(formData.taxAmount)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium text-navy-500">Total:</span>
                    <span className="text-lg font-bold text-navy-600">
                      {formatCurrency(formData.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <FormField
              label="Notes"
              type="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes or terms..."
              rows={3}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-coral-500 hover:bg-coral-600 text-white"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    {quote ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    {quote ? 'Update Quote' : 'Create Quote'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddQuoteModal