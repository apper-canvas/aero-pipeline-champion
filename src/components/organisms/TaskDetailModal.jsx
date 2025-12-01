import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

export default function TaskDetailModal({ task, onClose, onEdit, onDelete }) {
  function getPriorityBadgeVariant(priority) {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  }

  function getStatusBadgeVariant(status) {
    switch (status) {
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      case 'To Do': return 'outline';
      default: return 'outline';
    }
  }

  function isTaskOverdue(task) {
    if (!task.dueDate || task.status === 'Completed') return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  }

  function formatDate(dateString) {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lifted w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {task.title}
              {isTaskOverdue(task) && (
                <span className="ml-2 text-red-600 text-base font-normal">(Overdue)</span>
              )}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(task.status)}>
                {task.status}
              </Badge>
              <Badge variant={getPriorityBadgeVariant(task.priority)}>
                {task.priority} Priority
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Task Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Due Date:</span>
                  <span className={`text-sm font-medium ${isTaskOverdue(task) ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
                
                {task.assignee && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="User" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Assignee:</span>
                    <span className="text-sm font-medium text-gray-900">{task.assignee}</span>
                  </div>
                )}

                {task.dealId && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Link" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Deal ID:</span>
                    <span className="text-sm font-medium text-gray-900">#{task.dealId}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Timestamps</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm text-gray-900">{formatDateTime(task.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Updated:</span>
                  <span className="text-sm text-gray-900">{formatDateTime(task.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onDelete}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={onEdit}
          >
            <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}