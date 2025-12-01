import { useState, useEffect } from 'react'
import { dealService } from '@/services/api/dealService'
import { contactService } from '@/services/api/contactService'
import { stageService } from '@/services/api/stageService'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import FormField from '@/components/molecules/FormField'
import { toast } from 'react-toastify'

const AddDealModal = ({ isOpen, onClose, preselectedContact, onSuccess }) => {
  const [formData, setFormData] = useState({
    contactId: "",
    title: "",
    value: "",
    stage: "lead",
    notes: ""
  })
  const [contacts, setContacts] = useState([])
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      loadData()
      if (preselectedContact) {
        setFormData(prev => ({
          ...prev,
          contactId: preselectedContact.Id.toString()
        }))
      }
    }
  }, [isOpen, preselectedContact])

  const loadData = async () => {
    try {
      const [contactsData, stagesData] = await Promise.all([
        contactService.getAll(),
        stageService.getAll()
      ])
      setContacts(contactsData)
      setStages(stagesData)
    } catch (err) {
      toast.error("Failed to load form data")
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.contactId) newErrors.contactId = "Contact is required"
    if (!formData.title) newErrors.title = "Deal title is required"
    if (!formData.value) newErrors.value = "Deal value is required"
    if (formData.value && isNaN(parseFloat(formData.value))) {
      newErrors.value = "Deal value must be a valid number"
    }
    if (!formData.stage) newErrors.stage = "Stage is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      
      await dealService.create({
        contactId: parseInt(formData.contactId),
        title: formData.title,
        value: parseFloat(formData.value),
        stage: formData.stage,
        notes: formData.notes
      })

      toast.success("Deal created successfully!")
      onSuccess?.()
      handleClose()
    } catch (err) {
      toast.error("Failed to create deal")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      contactId: "",
      title: "",
      value: "",
      stage: "lead",
      notes: ""
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
          <h2 className="text-xl font-semibold text-navy-500">Add New Deal</h2>
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
            label="Contact"
            type="select"
            value={formData.contactId}
            onChange={handleChange("contactId")}
            placeholder="Select a contact"
            required
            error={errors.contactId}
            options={contacts.map(contact => ({
              value: contact.Id.toString(),
              label: `${contact.name} - ${contact.company}`
            }))}
          />

          <FormField
            label="Deal Title"
            type="text"
            value={formData.title}
            onChange={handleChange("title")}
            placeholder="Enter deal title"
            required
            error={errors.title}
          />

          <FormField
            label="Deal Value"
            type="number"
            value={formData.value}
            onChange={handleChange("value")}
            placeholder="0"
            required
            error={errors.value}
          />

          <FormField
            label="Stage"
            type="select"
            value={formData.stage}
            onChange={handleChange("stage")}
            placeholder="Select a stage"
            required
            error={errors.stage}
            options={stages.map(stage => ({
              value: stage.name.toLowerCase(),
              label: stage.name
            }))}
          />

          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={handleChange("notes")}
            placeholder="Add any notes about this deal..."
            error={errors.notes}
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
                "Create Deal"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDealModal