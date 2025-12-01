import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-blue-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-coral-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="AlertTriangle" className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-6xl font-bold text-navy-500">404</h1>
            <h2 className="text-2xl font-semibold text-navy-500">Page Not Found</h2>
            <p className="text-gray-600 leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Let's get you back to your pipeline.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/pipeline">
            <Button className="w-full sm:w-auto">
              <ApperIcon name="BarChart3" className="w-4 h-4 mr-2" />
              Back to Pipeline
            </Button>
          </Link>
          <Link to="/contacts">
            <Button variant="secondary" className="w-full sm:w-auto">
              <ApperIcon name="Users" className="w-4 h-4 mr-2" />
              View Contacts
            </Button>
          </Link>
        </div>

        {/* Help Links */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Need help?</p>
          <div className="flex flex-col space-y-2">
            <Link 
              to="/pipeline" 
              className="text-sm text-coral-500 hover:text-coral-600 transition-colors duration-200"
            >
              Check your sales pipeline →
            </Link>
            <Link 
              to="/contacts" 
              className="text-sm text-coral-500 hover:text-coral-600 transition-colors duration-200"
            >
              Manage your contacts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound