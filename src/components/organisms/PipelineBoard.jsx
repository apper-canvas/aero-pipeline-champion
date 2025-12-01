import { useState, useEffect } from 'react'
import { dealService } from '@/services/api/dealService'
import { stageService } from '@/services/api/stageService'
import { contactService } from '@/services/api/contactService'
import PipelineColumn from '@/components/molecules/PipelineColumn'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import { toast } from 'react-toastify'

const PipelineBoard = ({ onAddDeal, onEditDeal, onViewDeal }) => {
  const [deals, setDeals] = useState([])
  const [stages, setStages] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [dealsData, stagesData, contactsData] = await Promise.all([
        dealService.getAll(),
        stageService.getAll(),
        contactService.getAll()
      ])
      
      setDeals(dealsData)
      setStages(stagesData)
      setContacts(contactsData)
    } catch (err) {
      setError("Failed to load pipeline data. Please try again.")
      console.error("Error loading pipeline data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDragEnd = async (dealId, newStage) => {
    try {
      // Optimistically update UI
      setDeals(prevDeals =>
        prevDeals.map(deal =>
          deal.Id === dealId ? { ...deal, stage: newStage } : deal
        )
      )
      
      // Update backend
      await dealService.updateStage(dealId, newStage)
      toast.success("Deal moved successfully!")
      
    } catch (err) {
      // Revert on error
      setError("Failed to move deal")
      loadData()
      toast.error("Failed to move deal. Please try again.")
    }
  }

  const getDealsByStage = (stageName) => {
    return deals.filter(deal => deal.stage === stageName.toLowerCase())
  }

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId)
  }

  const calculateStageTotal = (stageName) => {
    const stageDeals = getDealsByStage(stageName)
    return stageDeals.reduce((total, deal) => total + deal.value, 0)
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadData} />
  if (deals.length === 0) {
    return (
      <Empty
        title="No deals in your pipeline"
        description="Start building your sales pipeline by adding your first deal"
        action={onAddDeal}
        actionLabel="Add First Deal"
        icon="Target"
      />
    )
  }

  return (
    <div className="h-full">
      <div className="flex gap-6 overflow-x-auto pb-4 min-h-[600px]">
        {stages.map((stage) => (
          <PipelineColumn
            key={stage.Id}
            stage={stage}
            deals={getDealsByStage(stage.name)}
            contacts={contacts}
            total={calculateStageTotal(stage.name)}
            onDragEnd={handleDragEnd}
            onEditDeal={onEditDeal}
            onViewDeal={onViewDeal}
            getContactById={getContactById}
          />
        ))}
      </div>
    </div>
  )
}

export default PipelineBoard