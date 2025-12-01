import { useState, useEffect } from 'react'
import { noteService } from '@/services/api/noteService'
import { contactService } from '@/services/api/contactService'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'

const DealDetailModal = ({ isOpen, onClose, deal }) => {
  const [notes, setNotes] = useState([])
  const [contact, setContact] = useState(null)
  const [newNote, setNewNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [addingNote, setAddingNote] = useState(false)

  useEffect(() => {
    if (isOpen && deal) {
      loadDealData()
    }
  }, [isOpen, deal])

  const loadDealData = async () => {
    if (!deal) return
    
    try {
      setLoading(true)
      const [notesData, contactData] = await Promise.all([
        noteService.getByDealId(deal.Id),
        contactService.getById(deal.contactId)
      ])
      setNotes(notesData)
      setContact(contactData)
    } catch (err) {
      toast.error("Failed to load deal details")
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim() || !deal) return

    try {
      setAddingNote(true)
      const note = await noteService.create({
        dealId: deal.Id,
        content: newNote.trim()
      })
      setNotes(prev => [note, ...prev])
      setNewNote("")
      toast.success("Note added successfully!")
    } catch (err) {
      toast.error("Failed to add note")
    } finally {
      setAddingNote(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStageColor = (stage) => {
    const colors = {
      lead: "default",
      qualified: "primary",
      proposal: "secondary",
      negotiation: "warning",
      won: "success",
      lost: "danger"
    }
    return colors[stage.toLowerCase()] || "default"
  }

  if (!isOpen || !deal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lifted w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-navy-500 mb-1">{deal.title}</h2>
            <p className="text-gray-600">
              {contact ? `${contact.name} • ${contact.company}` : 'Loading...'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>

        {/* Deal Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Deal Value</h3>
              <p className="text-2xl font-bold text-navy-500">{formatCurrency(deal.value)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Stage</h3>
              <Badge variant={getStageColor(deal.stage)} className="text-sm">
                {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
              <p className="text-sm text-gray-700">
                {formatDistanceToNow(new Date(deal.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Last Contact</h3>
              <p className="text-sm text-gray-700">
                {formatDistanceToNow(new Date(deal.lastContact), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {deal.notes && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Deal Description</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{deal.notes}</p>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-navy-500 mb-4">Activity Notes</h3>
          
          {/* Add Note */}
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note about this deal..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 resize-none"
                  rows={3}
                />
              </div>
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim() || addingNote}
                size="sm"
                className="self-start"
              >
                {addingNote ? (
                  <div className="flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                    Adding...
                  </div>
                ) : (
                  <>
                    <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                    Add
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Notes List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-coral-500 border-t-transparent mx-auto" />
              <p className="text-gray-500 mt-2">Loading notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="MessageSquare" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No notes yet for this deal</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.Id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-navy-100 to-blue-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="User" className="w-4 h-4 text-navy-500" />
                      </div>
                      <span className="text-sm font-medium text-navy-500">You</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DealDetailModal