import { useState } from 'react'
import PipelineBoard from '@/components/organisms/PipelineBoard'
import PipelineList from '@/components/organisms/PipelineList'
import AddDealModal from '@/components/organisms/AddDealModal'
import DealDetailModal from '@/components/organisms/DealDetailModal'
import AddContactModal from '@/components/organisms/AddContactModal'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
const Pipeline = () => {
  const [showAddDeal, setShowAddDeal] = useState(false)
  const [showAddContact, setShowAddContact] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [viewMode, setViewMode] = useState('kanban') // 'kanban' or 'list'
  const handleAddDeal = () => {
    setShowAddDeal(true)
  }

  const handleEditDeal = (deal) => {
    // For now, just view the deal - edit functionality would be similar to add
    setSelectedDeal(deal)
  }

  const handleViewDeal = (deal) => {
    setSelectedDeal(deal)
  }

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-500">Sales Pipeline</h1>
          <p className="text-gray-600 mt-1">Track and manage your sales opportunities</p>
        </div>
<div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ApperIcon name="Columns" className="w-4 h-4" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4" />
              List
            </button>
          </div>

          <Button
            variant="secondary"
            onClick={() => setShowAddContact(true)}
            className="hidden sm:flex items-center gap-2"
          >
            <ApperIcon name="UserPlus" className="w-4 h-4" />
            Add Contact
          </Button>
          <Button onClick={handleAddDeal} className="flex items-center gap-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Deal
          </Button>
        </div>
      </div>

{/* Pipeline View */}
      <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
        {viewMode === 'kanban' ? (
          <PipelineBoard
            key={refreshKey}
            onAddDeal={handleAddDeal}
            onEditDeal={handleEditDeal}
            onViewDeal={handleViewDeal}
          />
        ) : (
          <PipelineList
            key={refreshKey}
            onAddDeal={handleAddDeal}
            onEditDeal={handleEditDeal}
            onViewDeal={handleViewDeal}
          />
        )}
      </div>

      {/* Modals */}
      <AddDealModal
        isOpen={showAddDeal}
        onClose={() => setShowAddDeal(false)}
        onSuccess={handleSuccess}
      />

      <AddContactModal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onSuccess={handleSuccess}
      />

      <DealDetailModal
        isOpen={!!selectedDeal}
        onClose={() => setSelectedDeal(null)}
        deal={selectedDeal}
      />
    </div>
  )
}

export default Pipeline