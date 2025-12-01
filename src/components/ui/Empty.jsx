import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item", 
  action,
  actionLabel = "Add Item",
  icon = "Package"
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-gradient-to-br from-navy-50 to-blue-100 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} className="w-10 h-10 text-navy-500" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-navy-500">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        {action && (
          <button
            onClick={action}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-coral-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default Empty