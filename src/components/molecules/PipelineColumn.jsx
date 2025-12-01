import { useState } from 'react'
import DealCard from '@/components/molecules/DealCard'
import ApperIcon from '@/components/ApperIcon'

const PipelineColumn = ({ 
  stage, 
  deals, 
  contacts, 
  total, 
  onDragEnd, 
  onEditDeal, 
  onViewDeal, 
  getContactById 
}) => {
  const [draggedOver, setDraggedOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setDraggedOver(true)
  }

  const handleDragLeave = () => {
    setDraggedOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDraggedOver(false)
    
    const dealId = parseInt(e.dataTransfer.getData("text/plain"))
    if (dealId) {
      onDragEnd(dealId, stage.name.toLowerCase())
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div
      className={`flex-shrink-0 w-80 bg-white rounded-lg shadow-card border border-gray-200 transition-all duration-200 ${
        draggedOver ? 'border-coral-500 shadow-lifted bg-coral-50' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div 
        className="p-4 border-b border-gray-200 rounded-t-lg"
        style={{ backgroundColor: `${stage.color}15` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <h3 className="font-semibold text-navy-500">{stage.name}</h3>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {deals.length}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-navy-500">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {deals.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Inbox" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No deals in {stage.name.toLowerCase()}</p>
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.Id}
              deal={deal}
              contact={getContactById(deal.contactId)}
              onEdit={() => onEditDeal(deal)}
              onView={() => onViewDeal(deal)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default PipelineColumn