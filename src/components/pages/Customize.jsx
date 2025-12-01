import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Label from '@/components/atoms/Label'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import FormField from '@/components/molecules/FormField'
import { toast } from 'react-toastify'

const FIELD_TYPES = [
  { value: 'Text', label: 'Text' },
  { value: 'MultilineText', label: 'Multiline Text' },
  { value: 'Number', label: 'Number' },
  { value: 'Decimal', label: 'Decimal' },
  { value: 'Currency', label: 'Currency' },
  { value: 'Date', label: 'Date' },
  { value: 'DateTime', label: 'Date Time' },
  { value: 'Boolean', label: 'Boolean' },
  { value: 'Email', label: 'Email' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Website', label: 'Website' },
  { value: 'Picklist', label: 'Picklist' },
  { value: 'Multipicklist', label: 'Multi Picklist' },
  { value: 'Checkbox', label: 'Checkbox' },
  { value: 'Radio', label: 'Radio' },
  { value: 'Tag', label: 'Tag' },
  { value: 'Lookup', label: 'Lookup' },
  { value: 'MasterDetail', label: 'Master Detail' },
  { value: 'Files', label: 'Files' }
]

const FIELD_VISIBILITY_OPTIONS = [
  { value: 'Updateable', label: 'Updateable' },
  { value: 'ReadOnly', label: 'Read Only' },
  { value: 'System', label: 'System' }
]

function Customize() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [existingTables, setExistingTables] = useState([])
  const [selectedView, setSelectedView] = useState('tables') // 'tables', 'addTable', 'addField'
  const [selectedTable, setSelectedTable] = useState('')
  const [tableForm, setTableForm] = useState({
    name: '',
    label: '',
    plural: '',
    icon: 'Table'
  })
  const [fieldForm, setFieldForm] = useState({
    name: '',
    label: '',
    type: 'Text',
    fieldVisibility: 'Updateable',
    picklistValues: '',
    toTable: '',
    displayFieldsOfToTable: 'Name'
  })

  useEffect(() => {
    loadExistingTables()
  }, [])

  const loadExistingTables = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate loading existing tables from metadata
      // In real implementation, this would fetch from the server
      const tables = [
        { name: 'company_c', label: 'Company', plural: 'Companies', icon: 'Building', fieldCount: 15 },
        { name: 'contact_c', label: 'Contact', plural: 'Contacts', icon: 'Users', fieldCount: 10 },
        { name: 'deal_c', label: 'Deal', plural: 'Deals', icon: 'DollarSign', fieldCount: 11 },
        { name: 'note_c', label: 'Note', plural: 'Notes', icon: 'MessageSquare', fieldCount: 9 },
        { name: 'stage_c', label: 'Stage', plural: 'Stages', icon: 'GitBranch', fieldCount: 9 },
        { name: 'activity_c', label: 'Activity', plural: 'Activities', icon: 'Activity', fieldCount: 12 },
        { name: 'task_c', label: 'Task', plural: 'Tasks', icon: 'CheckSquare', fieldCount: 15 },
        { name: 'quote_c', label: 'Quote', plural: 'Quotes', icon: 'FileText', fieldCount: 18 },
        { name: 'sales_order_c', label: 'Sales Order', plural: 'Sales Orders', icon: 'FileText', fieldCount: 16 },
        { name: 'leads_c', label: 'Lead', plural: 'Leads', icon: 'UserPlus', fieldCount: 16 }
      ]
      
      setExistingTables(tables)
    } catch (err) {
      console.error('Error loading existing tables:', err)
      setError('Failed to load existing tables')
      toast.error('Failed to load existing tables')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTable = async (e) => {
    e.preventDefault()
    
    if (!tableForm.name || !tableForm.label) {
      toast.error('Table name and label are required')
      return
    }

    try {
      setLoading(true)
      
      // In real implementation, this would call Edge Function to create table
      console.log('Creating table:', tableForm)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(`Table "${tableForm.label}" created successfully`)
      setTableForm({
        name: '',
        label: '',
        plural: '',
        icon: 'Table'
      })
      setSelectedView('tables')
      await loadExistingTables()
    } catch (err) {
      console.error('Error creating table:', err)
      toast.error('Failed to create table')
    } finally {
      setLoading(false)
    }
  }

  const handleAddField = async (e) => {
    e.preventDefault()
    
    if (!selectedTable || !fieldForm.name || !fieldForm.label) {
      toast.error('Table selection, field name and label are required')
      return
    }

    try {
      setLoading(true)
      
      // In real implementation, this would call Edge Function to add field
      console.log('Adding field to table:', selectedTable, fieldForm)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(`Field "${fieldForm.label}" added to table successfully`)
      setFieldForm({
        name: '',
        label: '',
        type: 'Text',
        fieldVisibility: 'Updateable',
        picklistValues: '',
        toTable: '',
        displayFieldsOfToTable: 'Name'
      })
      setSelectedView('tables')
      await loadExistingTables()
    } catch (err) {
      console.error('Error adding field:', err)
      toast.error('Failed to add field')
    } finally {
      setLoading(false)
    }
  }

  if (loading && selectedView === 'tables') {
    return <Loading />
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadExistingTables} />
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Customize</h1>
        <p className="text-gray-600">Manage custom tables and fields for your application</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6">
        <Button
          variant={selectedView === 'tables' ? 'default' : 'outline'}
          onClick={() => setSelectedView('tables')}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Database" size={16} />
          Tables
        </Button>
        <Button
          variant={selectedView === 'addTable' ? 'default' : 'outline'}
          onClick={() => setSelectedView('addTable')}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          Add Table
        </Button>
        <Button
          variant={selectedView === 'addField' ? 'default' : 'outline'}
          onClick={() => setSelectedView('addField')}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Settings" size={16} />
          Add Field
        </Button>
      </div>

      {/* Tables View */}
      {selectedView === 'tables' && (
        <div className="bg-white rounded-lg shadow-card">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Existing Tables</h2>
            <p className="text-gray-600 mt-1">Manage your database tables and their fields</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fields
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Icon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {existingTables.map((table) => (
                  <tr key={table.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{table.name}</div>
                      <div className="text-sm text-gray-500">{table.plural}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{table.label}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{table.fieldCount} fields</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ApperIcon name={table.icon} size={20} className="text-gray-600" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTable(table.name)
                          setSelectedView('addField')
                        }}
                        className="text-coral-500 hover:text-coral-700"
                      >
                        Add Field
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Table View */}
      {selectedView === 'addTable' && (
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Create New Table</h2>
            <p className="text-gray-600">Add a new custom table to your database schema</p>
          </div>

          <form onSubmit={handleCreateTable} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Table Name"
                type="text"
                value={tableForm.name}
                onChange={(e) => setTableForm({ ...tableForm, name: e.target.value })}
                placeholder="e.g., custom_table_c"
                required
              />
              <FormField
                label="Display Label"
                type="text"
                value={tableForm.label}
                onChange={(e) => setTableForm({ ...tableForm, label: e.target.value })}
                placeholder="e.g., Custom Table"
                required
              />
              <FormField
                label="Plural Label"
                type="text"
                value={tableForm.plural}
                onChange={(e) => setTableForm({ ...tableForm, plural: e.target.value })}
                placeholder="e.g., Custom Tables"
              />
              <div className="space-y-2">
                <Label>Icon</Label>
                <Select
                  value={tableForm.icon}
                  onChange={(e) => setTableForm({ ...tableForm, icon: e.target.value })}
                >
                  <option value="Table">Table</option>
                  <option value="Database">Database</option>
                  <option value="Grid">Grid</option>
                  <option value="List">List</option>
                  <option value="FileText">FileText</option>
                  <option value="Folder">Folder</option>
                  <option value="Package">Package</option>
                  <option value="Box">Box</option>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <ApperIcon name="Plus" size={16} />
                )}
                Create Table
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedView('tables')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Add Field View */}
      {selectedView === 'addField' && (
        <div className="bg-white rounded-lg shadow-card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Add Field to Table</h2>
            <p className="text-gray-600">Add a new field to an existing table</p>
          </div>

          <form onSubmit={handleAddField} className="space-y-6">
            <div className="space-y-2">
              <Label>Select Table</Label>
              <Select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                required
              >
                <option value="">Choose a table...</option>
                {existingTables.map((table) => (
                  <option key={table.name} value={table.name}>
                    {table.label} ({table.name})
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Field Name"
                type="text"
                value={fieldForm.name}
                onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
                placeholder="e.g., custom_field_c"
                required
              />
              <FormField
                label="Display Label"
                type="text"
                value={fieldForm.label}
                onChange={(e) => setFieldForm({ ...fieldForm, label: e.target.value })}
                placeholder="e.g., Custom Field"
                required
              />
              <div className="space-y-2">
                <Label>Field Type</Label>
                <Select
                  value={fieldForm.type}
                  onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value })}
                  required
                >
                  {FIELD_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Field Visibility</Label>
                <Select
                  value={fieldForm.fieldVisibility}
                  onChange={(e) => setFieldForm({ ...fieldForm, fieldVisibility: e.target.value })}
                  required
                >
                  {FIELD_VISIBILITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Conditional fields based on field type */}
            {(fieldForm.type === 'Picklist' || fieldForm.type === 'Multipicklist' || 
              fieldForm.type === 'Checkbox' || fieldForm.type === 'Radio') && (
              <FormField
                label="Picklist Values"
                type="text"
                value={fieldForm.picklistValues}
                onChange={(e) => setFieldForm({ ...fieldForm, picklistValues: e.target.value })}
                placeholder="e.g., Option1,Option2,Option3"
                helperText="Separate multiple values with commas"
              />
            )}

            {(fieldForm.type === 'Lookup' || fieldForm.type === 'MasterDetail') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Related Table</Label>
                  <Select
                    value={fieldForm.toTable}
                    onChange={(e) => setFieldForm({ ...fieldForm, toTable: e.target.value })}
                    required
                  >
                    <option value="">Choose a table...</option>
                    {existingTables.map((table) => (
                      <option key={table.name} value={table.name}>
                        {table.label} ({table.name})
                      </option>
                    ))}
                  </Select>
                </div>
                <FormField
                  label="Display Field"
                  type="text"
                  value={fieldForm.displayFieldsOfToTable}
                  onChange={(e) => setFieldForm({ ...fieldForm, displayFieldsOfToTable: e.target.value })}
                  placeholder="Name"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading || !selectedTable}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <ApperIcon name="Plus" size={16} />
                )}
                Add Field
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedView('tables')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Customize