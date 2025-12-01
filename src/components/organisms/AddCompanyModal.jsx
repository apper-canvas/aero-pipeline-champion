import { useState, useEffect } from 'react'
import { companyService } from '@/services/api/companyService'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'
import { toast } from 'react-toastify'

const AddCompanyModal = ({ isOpen, onClose, onSuccess, company = null, editMode = false }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    employees: '',
    revenue: '',
    notes: ''
  })

  // Populate form with company data when editing
  useEffect(() => {
    if (editMode && company) {
      setFormData({
        name: company.name || '',
        industry: company.industry || '',
        website: company.website || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || '',
        employees: company.employees?.toString() || '',
        revenue: company.revenue?.toString() || '',
        notes: company.notes || ''
      })
    } else {
      setFormData({
        name: '',
        industry: '',
        website: '',
        phone: '',
        email: '',
        address: '',
        employees: '',
        revenue: '',
        notes: ''
      })
    }
  }, [editMode, company])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Company name is required')
      return
    }

    setLoading(true)

    try {
      if (editMode && company) {
        await companyService.update(company.Id, formData)
        toast.success('Company updated successfully')
      } else {
        await companyService.create(formData)
        toast.success('Company created successfully')
      }
      onSuccess()
    } catch (error) {
      toast.error(`Failed to ${editMode ? 'update' : 'create'} company: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lifted max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-navy-500">
            {editMode ? 'Edit Company' : 'Add New Company'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                label="Company Name *"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
            </div>

            <FormField
              label="Industry"
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g., Technology, Manufacturing"
            />

            <FormField
              label="Website"
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />

            <FormField
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
            />

            <FormField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@company.com"
            />

            <FormField
              label="Employees"
              type="number"
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              placeholder="Number of employees"
              min="0"
            />

            <FormField
              label="Annual Revenue"
              type="number"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              placeholder="Annual revenue (USD)"
              min="0"
            />

            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full company address"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about the company"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coral-500 focus:border-coral-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  {editMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <ApperIcon name={editMode ? "Save" : "Plus"} className="w-4 h-4 mr-2" />
                  {editMode ? 'Update Company' : 'Create Company'}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCompanyModal