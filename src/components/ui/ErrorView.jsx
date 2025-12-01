import ApperIcon from '@/components/ApperIcon'

const ErrorView = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-navy-500">Oops! Something went wrong</h3>
          <p className="text-gray-600">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-coral-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorView