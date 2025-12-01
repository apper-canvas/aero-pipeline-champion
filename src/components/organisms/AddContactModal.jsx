import { useState } from 'react'
import { contactService } from '@/services/api/contactService'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import { toast } from 'react-toastify'

const AddContactModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    tags: []
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.company.trim()) newErrors.company = "Company is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      
      await contactService.create({
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        tags: ["warm"] // Default tag
      })

      toast.success("Contact created successfully!")
      onSuccess?.()
      handleClose()
    } catch (err) {
      toast.error("Failed to create contact")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      tags: []
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lifted w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-navy-500">Add New Contact</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Enter full name"
            required
            error={errors.name}
          />

          <FormField
            label="Company"
            type="text"
            value={formData.company}
            onChange={handleChange("company")}
            placeholder="Enter company name"
            required
            error={errors.company}
          />

          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="Enter email address"
            required
            error={errors.email}
          />

          <FormField
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            placeholder="Enter phone number"
            error={errors.phone}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Creating...
                </div>
              ) : (
                "Create Contact"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddContactModal