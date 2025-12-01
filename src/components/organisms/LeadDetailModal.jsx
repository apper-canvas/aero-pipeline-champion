import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'

const LeadDetailModal = ({ isOpen, onClose, lead, onEdit, onDelete }) => {
  if (!isOpen || !lead) return null

  const safeDateFormat = (dateValue, fallback = "Unknown") => {
    if (!dateValue) return fallback
    try {
      return formatDistanceToNow(new Date(dateValue), { addSuffix: true })
    } catch {
      return fallback
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      New: "default",
      Contacted: "primary", 
      Qualified: "secondary",
      Lost: "danger",
      Converted: "success"
    }
    return colors[status] || "default"
  }

  const getSourceColor = (source) => {
    const colors = {
      Web: "primary",
      Referral: "success",
      "Trade Show": "secondary",
      Advertisement: "warning"
    }
    return colors[source] || "default"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lifted w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-navy-500">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Lead Information */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {lead.Name || `${lead.first_name_c || ""} ${lead.last_name_c || ""}`.trim() || "Unnamed Lead"}
                </h3>
                <p className="text-sm text-gray-500">Lead ID: {lead.Id}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={getStatusColor(lead.status_c)}>
                  {lead.status_c || "No Status"}
                </Badge>
                {lead.source_c && (
                  <Badge variant={getSourceColor(lead.source_c)}>
                    {lead.source_c}
                  </Badge>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{lead.email_c || "No email"}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{lead.phone_c || "No phone"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <div className="flex items-center gap-2 mt-1">
                    <ApperIcon name="Building" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{lead.company_c || "No company"}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Source</label>
                  <div className="flex items-center gap-2 mt-1">
                    <ApperIcon name="Globe" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{lead.source_c || "Unknown source"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            {lead.address_c && (
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <div className="flex items-start gap-2 mt-1">
                  <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-900 whitespace-pre-line">{lead.address_c}</span>
                </div>
              </div>
            )}

            {/* Notes */}
            {lead.notes_c && (
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-900 whitespace-pre-line">{lead.notes_c}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Timeline</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span>Created {safeDateFormat(lead.CreatedOn)}</span>
                </div>
                {lead.ModifiedOn && lead.ModifiedOn !== lead.CreatedOn && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ApperIcon name="Edit" className="w-4 h-4" />
                    <span>Last modified {safeDateFormat(lead.ModifiedOn)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => onEdit?.(lead)}
              className="flex-1"
            >
              <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
              Edit Lead
            </Button>
            <Button
              variant="danger"
              onClick={() => onDelete?.(lead.Id)}
              className="flex-1"
            >
              <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadDetailModal