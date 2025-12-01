import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { formatDistanceToNow } from 'date-fns'

const DealCard = ({ deal, contact, onEdit, onView }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", deal.Id.toString())
    setIsDragging(true)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getDaysInStage = () => {
    const daysSinceLastContact = Math.floor(
      (new Date() - new Date(deal.lastContact)) / (1000 * 60 * 60 * 24)
    )
    return daysSinceLastContact
  }

  const getValueBadgeVariant = (value) => {
    if (value >= 15000) return "success"
    if (value >= 8000) return "warning"
    return "default"
  }

  const isHighValue = deal.value >= 5000

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`bg-white border rounded-lg p-4 cursor-move transition-all duration-200 hover:shadow-lifted hover:scale-102 ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${isHighValue ? 'border-l-4 border-l-coral-500' : 'border-gray-200'}`}
    >
      {/* Deal Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-navy-500 truncate">{deal.title}</h4>
          <p className="text-sm text-gray-600 truncate">
            {contact ? `${contact.name} • ${contact.company}` : 'Unknown Contact'}
          </p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
            className="p-1 text-gray-400 hover:text-navy-500 transition-colors duration-200"
          >
            <ApperIcon name="Eye" className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-1 text-gray-400 hover:text-navy-500 transition-colors duration-200"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Deal Value */}
      <div className="mb-3">
        <Badge variant={getValueBadgeVariant(deal.value)} className="text-sm font-semibold">
          {formatCurrency(deal.value)}
        </Badge>
      </div>

      {/* Deal Metadata */}
      <div className="space-y-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <ApperIcon name="Clock" className="w-3 h-3" />
          <span>
            {getDaysInStage() === 0 
              ? 'Updated today' 
              : `${getDaysInStage()} days in stage`
            }
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ApperIcon name="Calendar" className="w-3 h-3" />
          <span>
            Last contact: {formatDistanceToNow(new Date(deal.lastContact), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Deal Notes Preview */}
      {deal.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600 line-clamp-2">{deal.notes}</p>
        </div>
      )}
    </div>
  )
}

export default DealCard