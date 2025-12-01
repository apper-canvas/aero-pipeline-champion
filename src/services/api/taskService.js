import tasksData from "@/services/mockData/tasks.json";

function delay() {
  return new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
}

let taskData = [...tasksData];

export const taskService = {
  async getAll() {
    await delay();
    return [...taskData];
  },

  async getById(id) {
    await delay();
    const task = taskData.find(task => task.Id === parseInt(id));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

async create(newTaskData) {
    await delay();
    const newTask = {
      ...newTaskData,
      Id: Math.max(...taskData.map(t => t.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    taskData.push(newTask);
    return { ...newTask };
  },

  async update(id, updatedData) {
    await delay();
    const index = taskData.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...taskData[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    taskData[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay();
    const index = taskData.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const deletedTask = { ...taskData[index] };
    taskData.splice(index, 1);
    return deletedTask;
  },

  async getByStatus(status) {
    await delay();
    return taskData.filter(task => task.status === status).map(task => ({ ...task }));
  },

  async getByPriority(priority) {
    await delay();
    return taskData.filter(task => task.priority === priority).map(task => ({ ...task }));
  },

  async getOverdueTasks() {
    await delay();
    const today = new Date().toISOString().split('T')[0];
    return taskData.filter(task => 
      task.dueDate && task.dueDate < today && task.status !== 'Completed'
    ).map(task => ({ ...task }));
  },

  async searchTasks(query) {
    await delay();
    const searchQuery = query.toLowerCase();
    return taskData.filter(task => 
      task.title.toLowerCase().includes(searchQuery) ||
      task.description.toLowerCase().includes(searchQuery)
    ).map(task => ({ ...task }));
  }
};