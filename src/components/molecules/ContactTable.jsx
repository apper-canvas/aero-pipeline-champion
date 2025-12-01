import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import { formatDistanceToNow } from 'date-fns'

const ContactTable = ({ contacts, deals, onEditContact, onViewContact, onAddDeal }) => {
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getContactDeals = (contactId) => {
    return deals.filter(deal => deal.contactId === contactId)
  }

  const getContactValue = (contactId) => {
    const contactDeals = getContactDeals(contactId)
    return contactDeals.reduce((total, deal) => total + deal.value, 0)
  }

  const sortedContacts = [...contacts].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (sortField === "totalValue") {
      aValue = getContactValue(a.Id)
      bValue = getContactValue(b.Id)
    }

    if (sortField === "dealsCount") {
      aValue = getContactDeals(a.Id).length
      bValue = getContactDeals(b.Id).length
    }

    if (sortField === "createdAt") {
      aValue = new Date(a.createdAt)
      bValue = new Date(b.createdAt)
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null
    return (
      <ApperIcon 
        name={sortDirection === "asc" ? "ChevronUp" : "ChevronDown"} 
        className="w-4 h-4 ml-1" 
      />
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-card border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-navy-50 to-blue-50 border-b border-gray-200">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider cursor-pointer hover:bg-navy-100 transition-colors duration-200"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Contact
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider cursor-pointer hover:bg-navy-100 transition-colors duration-200"
                onClick={() => handleSort("company")}
              >
                <div className="flex items-center">
                  Company
                  <SortIcon field="company" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider cursor-pointer hover:bg-navy-100 transition-colors duration-200"
                onClick={() => handleSort("dealsCount")}
              >
                <div className="flex items-center">
                  Deals
                  <SortIcon field="dealsCount" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider cursor-pointer hover:bg-navy-100 transition-colors duration-200"
                onClick={() => handleSort("totalValue")}
              >
                <div className="flex items-center">
                  Total Value
                  <SortIcon field="totalValue" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider cursor-pointer hover:bg-navy-100 transition-colors duration-200"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Added
                  <SortIcon field="createdAt" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-navy-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedContacts.map((contact) => {
              const contactDeals = getContactDeals(contact.Id)
              const totalValue = getContactValue(contact.Id)
              
              return (
                <tr key={contact.Id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-coral-100 to-red-100 rounded-full flex items-center justify-center">
                        <span className="text-coral-600 font-medium text-sm">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-navy-500">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-navy-500">{contact.company}</div>
                    <div className="text-sm text-gray-500">{contact.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={contactDeals.length > 0 ? "primary" : "default"}>
                      {contactDeals.length} {contactDeals.length === 1 ? 'deal' : 'deals'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-navy-500">
                      {formatCurrency(totalValue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewContact(contact)}
                        className="text-navy-500 hover:text-navy-700 transition-colors duration-200"
                      >
                        <ApperIcon name="Eye" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditContact(contact)}
                        className="text-navy-500 hover:text-navy-700 transition-colors duration-200"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => onAddDeal(contact)}
                        className="text-coral-500 hover:text-coral-700 hover:bg-coral-50"
                      >
                        <ApperIcon name="Plus" className="w-3 h-3 mr-1" />
                        Deal
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ContactTable