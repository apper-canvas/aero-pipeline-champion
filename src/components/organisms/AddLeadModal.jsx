import { useState } from 'react'
import { leadService } from '@/services/api/leadService'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import { toast } from 'react-toastify'

const AddLeadModal = ({ isOpen, onClose, onSuccess, editLead }) => {
  const [formData, setFormData] = useState({
    Name: "",
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    company_c: "",
    status_c: "New",
    source_c: "",
    notes_c: "",
    address_c: ""
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useState(() => {
    if (isOpen) {
      if (editLead) {
        setFormData({
          Name: editLead.Name || "",
          first_name_c: editLead.first_name_c || "",
          last_name_c: editLead.last_name_c || "",
          email_c: editLead.email_c || "",
          phone_c: editLead.phone_c || "",
          company_c: editLead.company_c || "",
          status_c: editLead.status_c || "New",
          source_c: editLead.source_c || "",
          notes_c: editLead.notes_c || "",
          address_c: editLead.address_c || ""
        })
      } else {
        setFormData({
          Name: "",
          first_name_c: "",
          last_name_c: "",
          email_c: "",
          phone_c: "",
          company_c: "",
          status_c: "New",
          source_c: "",
          notes_c: "",
          address_c: ""
        })
      }
    }
  }, [isOpen, editLead])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.first_name_c) newErrors.first_name_c = "First name is required"
    if (!formData.last_name_c) newErrors.last_name_c = "Last name is required"
    if (!formData.email_c) newErrors.email_c = "Email is required"
    if (formData.email_c && !/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Please enter a valid email address"
    }
    if (!formData.status_c) newErrors.status_c = "Status is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      
      const leadData = {
        ...formData,
        Name: `${formData.first_name_c} ${formData.last_name_c}`.trim()
      }

      if (editLead) {
        await leadService.update(editLead.Id, leadData)
        toast.success("Lead updated successfully!")
      } else {
        await leadService.create(leadData)
        toast.success("Lead created successfully!")
      }

      onSuccess?.()
      handleClose()
    } catch (err) {
      toast.error(editLead ? "Failed to update lead" : "Failed to create lead")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      Name: "",
      first_name_c: "",
      last_name_c: "",
      email_c: "",
      phone_c: "",
      company_c: "",
      status_c: "New",
      source_c: "",
      notes_c: "",
      address_c: ""
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

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Contacted", label: "Contacted" },
    { value: "Qualified", label: "Qualified" },
    { value: "Lost", label: "Lost" },
    { value: "Converted", label: "Converted" }
  ]

  const sourceOptions = [
    { value: "Web", label: "Web" },
    { value: "Referral", label: "Referral" },
    { value: "Trade Show", label: "Trade Show" },
    { value: "Advertisement", label: "Advertisement" }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lifted w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-navy-500">
            {editLead ? "Edit Lead" : "Add New Lead"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="First Name"
              type="text"
              value={formData.first_name_c}
              onChange={handleChange("first_name_c")}
              placeholder="Enter first name"
              required
              error={errors.first_name_c}
            />

            <FormField
              label="Last Name"
              type="text"
              value={formData.last_name_c}
              onChange={handleChange("last_name_c")}
              placeholder="Enter last name"
              required
              error={errors.last_name_c}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Email"
              type="email"
              value={formData.email_c}
              onChange={handleChange("email_c")}
              placeholder="Enter email address"
              required
              error={errors.email_c}
            />

            <FormField
              label="Phone"
              type="tel"
              value={formData.phone_c}
              onChange={handleChange("phone_c")}
              placeholder="Enter phone number"
              error={errors.phone_c}
            />
          </div>

          <FormField
            label="Company"
            type="text"
            value={formData.company_c}
            onChange={handleChange("company_c")}
            placeholder="Enter company name"
            error={errors.company_c}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Status"
              type="select"
              value={formData.status_c}
              onChange={handleChange("status_c")}
              placeholder="Select status"
              required
              error={errors.status_c}
              options={statusOptions}
            />

            <FormField
              label="Source"
              type="select"
              value={formData.source_c}
              onChange={handleChange("source_c")}
              placeholder="Select source"
              error={errors.source_c}
              options={sourceOptions}
            />
          </div>

          <FormField
            label="Address"
            type="textarea"
            value={formData.address_c}
            onChange={handleChange("address_c")}
            placeholder="Enter address..."
            error={errors.address_c}
          />

          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes_c}
            onChange={handleChange("notes_c")}
            placeholder="Add any notes about this lead..."
            error={errors.notes_c}
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
                  {editLead ? "Updating..." : "Creating..."}
                </div>
              ) : (
                editLead ? "Update Lead" : "Create Lead"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLeadModal