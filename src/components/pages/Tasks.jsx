import React, { useEffect, useState } from "react";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";
import { getAll } from "@/services/api/companyService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import AddTaskModal from "@/components/organisms/AddTaskModal";
import TaskDetailModal from "@/components/organisms/TaskDetailModal";
import SearchBar from "@/components/molecules/SearchBar";


export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  function filterTasks() {
    let filtered = [...tasks];

    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }

  function handleSearch(query) {
    setSearchQuery(query);
  }

  function handleAddTask() {
    setSelectedTask(null);
    setIsEditing(false);
    setShowAddModal(true);
  }

  function handleEditTask(task) {
    setSelectedTask(task);
    setIsEditing(true);
    setShowAddModal(true);
  }

  function handleViewTask(task) {
    setSelectedTask(task);
    setShowDetailModal(true);
  }

  async function handleDeleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(task => task.Id !== taskId));
      setShowDetailModal(false);
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  }

  async function handleSuccess() {
    await loadData();
    setShowAddModal(false);
    setShowDetailModal(false);
    toast.success(isEditing ? 'Task updated successfully' : 'Task created successfully');
  }

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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-600 mt-1">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>
        
        <Button onClick={handleAddTask} className="w-full sm:w-auto">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-card">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search tasks..."
                onSearch={handleSearch}
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
                className="w-full sm:w-40"
              >
                <option value="all">All Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>

              <Select
                value={priorityFilter}
                onValueChange={setPriorityFilter}
                className="w-full sm:w-40"
              >
                <option value="all">All Priority</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredTasks.length === 0 ? (
            <Empty
              title="No tasks found"
              description={searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by creating your first task."
              }
              action={
                <Button onClick={handleAddTask}>
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.Id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    isTaskOverdue(task) ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleViewTask(task)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {task.title}
                        {isTaskOverdue(task) && (
                          <span className="ml-2 text-red-600 text-sm font-normal">(Overdue)</span>
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant={getStatusBadgeVariant(task.status)}>
                        {task.status}
                      </Badge>
                      <Badge variant={getPriorityBadgeVariant(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" className="w-4 h-4" />
                        <span className={isTaskOverdue(task) ? 'text-red-600' : ''}>
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                      
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <ApperIcon name="User" className="w-4 h-4" />
                          <span>{task.assignee}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTask(task);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddTaskModal
          task={selectedTask}
          isEditing={isEditing}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showDetailModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => {
            setShowDetailModal(false);
            handleEditTask(selectedTask);
          }}
          onDelete={() => handleDeleteTask(selectedTask.Id)}
        />
      )}
    </div>
  );
}