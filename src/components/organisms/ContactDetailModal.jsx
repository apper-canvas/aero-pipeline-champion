import React, { useEffect, useState } from "react";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
const ContactDetailModal = ({ isOpen, onClose, contact, onAddDeal }) => {
const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  const [newActivity, setNewActivity] = useState({ type: 'note', title: '', description: '' })
  const [addingActivity, setAddingActivity] = useState(false)
useEffect(() => {
    if (isOpen && contact) {
      loadContactData()
    }
  }, [isOpen, contact])

const loadContactData = async () => {
    if (!contact) return
    
    try {
      setLoading(true)
      const [dealsData, activitiesData] = await Promise.all([
        dealService.getByContactId(contact.Id),
        activityService.getByContactId(contact.Id)
      ])
      setDeals(dealsData)
      setActivities(activitiesData)
    } catch (err) {
      toast.error("Failed to load contact data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddActivity = async () => {
    if (!newActivity.title.trim() || !contact) return

    try {
      setAddingActivity(true)
      const activity = await activityService.create({
        contactId: contact.Id,
        type: newActivity.type,
        title: newActivity.title.trim(),
        description: newActivity.description.trim()
      })
      setActivities(prev => [activity, ...prev])
      setNewActivity({ type: 'note', title: '', description: '' })
      toast.success("Activity added successfully!")
    } catch (err) {
      toast.error("Failed to add activity")
    } finally {
      setAddingActivity(false)
    }
  }

  const getTotalValue = () => {
    return deals.reduce((total, deal) => total + deal.value, 0)
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

  if (!isOpen || !contact) return null

  return (
    <div
    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div
        className="bg-white rounded-lg shadow-lifted w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
            className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
                <div
                    className="w-16 h-16 bg-gradient-to-br from-coral-100 to-red-100 rounded-full flex items-center justify-center">
                    <span className="text-coral-600 font-semibold text-xl">
                        {contact.name.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-navy-500">{contact.name}</h2>
                    <p className="text-gray-600">{contact.company}</p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <ApperIcon name="X" className="w-6 h-6" />
            </button>
        </div>
        {/* Tabs */}
        <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
                {[{
                    id: "info",
                    label: "Information",
                    icon: "User"
                }, {
                    id: "deals",
                    label: "Deals",
                    icon: "TrendingUp"
                }, {
                    id: "activities",
                    label: "Activity Timeline",
                    icon: "Activity"
                }].map(tab => <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id ? "border-coral-500 text-coral-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                    <ApperIcon name={tab.icon} className="w-4 h-4" />
                    {tab.label}
                    {tab.id === "deals" && <Badge variant="default" className="ml-1">
                        {deals.length}
                    </Badge>}
                </button>)}
            </nav>
        </div>
        {/* Tab Content */}
        <div className="p-6">
            {activeTab === "info" && <div className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Email</h3>
                        <p className="text-sm text-gray-700">{contact.email}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Phone</h3>
                        <p className="text-sm text-gray-700">{contact.phone || "Not provided"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Company</h3>
                        <p className="text-sm text-gray-700">{contact.company}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Added</h3>
                        <p className="text-sm text-gray-700">
                            {formatDistanceToNow(new Date(contact.createdAt), {
                                addSuffix: true
                            })}
                        </p>
                    </div>
                </div>
                {/* Tags */}
                {contact.tags && contact.tags.length > 0 && <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {contact.tags.map((tag, index) => <Badge key={index} variant="primary">
                            {tag}
                        </Badge>)}
                    </div>
                </div>}
                {/* Quick Stats */}
                <div className="bg-gradient-to-r from-navy-50 to-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-navy-500 mb-4">Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-2xl font-bold text-navy-500">{deals.length}</p>
                            <p className="text-sm text-gray-600">Total Deals</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-navy-500">{formatCurrency(getTotalValue())}</p>
                            <p className="text-sm text-gray-600">Total Value</p>
                        </div>
                    </div>
                </div>
            </div>}
            {activeTab === "deals" && <div className="space-y-6">
                {/* Add Deal Button */}
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-navy-500">Deals</h3>
                    <Button onClick={() => onAddDeal(contact)}>
                        <ApperIcon name="Plus" className="w-4 h-4 mr-2" />Add Deal
                                        </Button>
                </div>
                {/* Deals List */}
                {loading ? <div className="text-center py-8">
                    <div
                        className="animate-spin rounded-full h-8 w-8 border-2 border-coral-500 border-t-transparent mx-auto" />
                    <p className="text-gray-500 mt-2">Loading deals...</p>
                </div> : deals.length === 0 ? <div className="text-center py-8">
                    <ApperIcon name="Target" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No deals yet for this contact</p>
                    <Button variant="ghost" onClick={() => onAddDeal(contact)} className="mt-2">Create first deal
                                          </Button>
                </div> : <div className="space-y-4">
                    {deals.map(deal => <div
                        key={deal.Id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h4 className="font-medium text-navy-500">{deal.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{deal.notes}</p>
                            </div>
                            <Badge variant={getStageColor(deal.stage)} className="ml-4">
                                {deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span className="font-medium text-navy-500">
                                {formatCurrency(deal.value)}
                            </span>
                            <span>Updated {formatDistanceToNow(new Date(deal.lastContact), {
                                    addSuffix: true
                                })}
                            </span>
                        </div>
                    </div>)}
                </div>}
            </div>}
        </div>
        {activeTab === "activities" && <div className="space-y-6">
            {/* Add Activity Form */}
            <div className="bg-gradient-to-r from-navy-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-navy-500 mb-4">Log New Activity</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Type</label>
                            <select
                                value={newActivity.type}
                                onChange={e => setNewActivity(prev => ({
                                    ...prev,
                                    type: e.target.value
                                }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500">
                                <option value="call">Phone Call</option>
                                <option value="email">Email</option>
                                <option value="meeting">Meeting</option>
                                <option value="note">Note</option>
                                <option value="task">Task</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={newActivity.title}
                                onChange={e => setNewActivity(prev => ({
                                    ...prev,
                                    title: e.target.value
                                }))}
                                placeholder="Activity title..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={newActivity.description}
                            onChange={e => setNewActivity(prev => ({
                                ...prev,
                                description: e.target.value
                            }))}
                            placeholder="Activity details..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500/50 focus:border-coral-500 resize-none" />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleAddActivity}
                            disabled={!newActivity.title.trim() || addingActivity}
                            size="sm">
                            {addingActivity ? <div className="flex items-center gap-2">
                                <div
                                    className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />Adding...
                                                        </div> : <>
                                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />Add Activity
                                                        </>}
                        </Button>
                    </div>
                </div>
            </div>
            {/* Activity Timeline */}
            <div>
                <h3 className="text-lg font-semibold text-navy-500 mb-4">Activity Timeline</h3>
                {loading ? <div className="text-center py-8">
                    <div
                        className="animate-spin rounded-full h-8 w-8 border-2 border-coral-500 border-t-transparent mx-auto" />
                    <p className="text-gray-500 mt-2">Loading activities...</p>
                </div> : activities.length === 0 ? <div className="text-center py-8">
                    <ApperIcon name="Activity" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No activities yet for this contact</p>
                </div> : <div className="space-y-4">
                    {activities.map((activity, index) => <div key={activity.Id} className="relative">
                        {/* Timeline line */}
                        {index !== activities.length - 1 && <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />}
                        {/* Activity item */}
                        <div className="flex gap-4">
                            <div
                                className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${activityService.getActivityTypeColor(activity.type)} flex items-center justify-center`}>
                                <ApperIcon
                                    name={activityService.getActivityTypeIcon(activity.type)}
                                    className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-medium text-navy-500">{activity.title}</h4>
                                        <p className="text-xs text-gray-500 capitalize">{activity.type}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(activity.createdAt), {
                                            addSuffix: true
                                        })}
                                    </span>
                                </div>
                                {activity.description && <p className="text-sm text-gray-700 leading-relaxed">{activity.description}</p>}
                            </div>
                        </div>
                    </div>)}
                </div>}
            </div>
        </div>}
    </div>
    {/* Footer */}
    <div className="p-6 border-t border-gray-200 flex justify-end">
        <Button variant="secondary" onClick={onClose}>Close
                      </Button>
    </div>
</div>
  )
}

export default ContactDetailModal