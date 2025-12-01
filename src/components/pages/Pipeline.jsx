import { useState } from 'react'
import PipelineBoard from '@/components/organisms/PipelineBoard'
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

      {/* Pipeline Board */}
      <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
        <PipelineBoard
          key={refreshKey}
          onAddDeal={handleAddDeal}
          onEditDeal={handleEditDeal}
          onViewDeal={handleViewDeal}
        />
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