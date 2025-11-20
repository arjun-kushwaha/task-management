let users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: 2, username: 'emp1', password: 'emp123', role: 'employee', name: 'Rajesh Kumar' },
  { id: 3, username: 'emp2', password: 'emp123', role: 'employee', name: 'Priya Sharma' },
  { id: 4, username: 'emp3', password: 'emp123', role: 'employee', name: 'Amit Patel' }
];

let clients = [
  { id: 1, name: 'ABC Company', code: 'ABC001' },
  { id: 2, name: 'XYZ Industries', code: 'XYZ002' },
  { id: 3, name: 'Tech Solutions Ltd', code: 'TECH003' },
  { id: 4, name: 'Global Traders', code: 'GLB004' }
];

let tasks = [
  {
    id: 1,
    clientId: 1,
    taskCategory: 'Bank Statement',
    taskName: 'Bank A',
    assignedTo: 2,
    status: 'pending',
    updatedTill: null,
    createdBy: 1,
    createdAt: '2025-01-10',
    updatedAt: '2025-01-10',
    approvalStatus: 'pending'
  },
  {
    id: 2,
    clientId: 1,
    taskCategory: 'Bank Statement',
    taskName: 'Bank B',
    assignedTo: 2,
    status: 'in_progress',
    updatedTill: '2024-09-30',
    createdBy: 1,
    createdAt: '2025-01-10',
    updatedAt: '2025-01-15',
    approvalStatus: 'approved'
  },
  {
    id: 3,
    clientId: 1,
    taskCategory: 'Return File',
    taskName: 'GST Return',
    assignedTo: 3,
    status: 'completed',
    updatedTill: '2025-10-31',
    createdBy: 1,
    createdAt: '2025-01-12',
    updatedAt: '2025-01-18',
    approvalStatus: 'approved'
  },
  {
    id: 4,
    clientId: 2,
    taskCategory: 'Audit',
    taskName: 'Annual Audit',
    assignedTo: 2,
    status: 'in_progress',
    updatedTill: '2025-03-31',
    createdBy: 1,
    createdAt: '2025-01-05',
    updatedAt: '2025-01-16',
    approvalStatus: 'pending'
  },
  {
    id: 5,
    clientId: 3,
    taskCategory: 'Tax Filing',
    taskName: 'Income Tax Return',
    assignedTo: 4,
    status: 'pending',
    updatedTill: null,
    createdBy: 1,
    createdAt: '2025-01-08',
    updatedAt: '2025-01-08',
    approvalStatus: 'pending'
  }
];

let taskIdCounter = 6;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  login: async (username, password) => {
    await delay(500);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }
    return { success: false, message: 'Invalid credentials' };
  },

  getClients: async () => {
    await delay(300);
    return { success: true, data: clients };
  },

  getEmployees: async () => {
    await delay(300);
    const employees = users.filter(u => u.role === 'employee');
    return { success: true, data: employees };
  },

  getTasks: async (filters = {}) => {
    await delay(300);
    let filteredTasks = [...tasks];

    if (filters.employeeId) {
      filteredTasks = filteredTasks.filter(t => t.assignedTo === filters.employeeId);
    }
    if (filters.clientId) {
      filteredTasks = filteredTasks.filter(t => t.clientId === filters.clientId);
    }
    if (filters.status) {
      filteredTasks = filteredTasks.filter(t => t.status === filters.status);
    }
    if (filters.approvalStatus) {
      filteredTasks = filteredTasks.filter(t => t.approvalStatus === filters.approvalStatus);
    }

    const tasksWithDetails = filteredTasks.map(task => ({
      ...task,
      clientName: clients.find(c => c.id === task.clientId)?.name || 'Unknown',
      employeeName: users.find(u => u.id === task.assignedTo)?.name || 'Unassigned'
    }));

    return { success: true, data: tasksWithDetails };
  },

  createTask: async (taskData) => {
    await delay(300);
    const newTask = {
      id: taskIdCounter++,
      ...taskData,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
      approvalStatus: 'pending',
      updatedTill: null
    };
    tasks.push(newTask);
    return { success: true, data: newTask };
  },

  updateTask: async (taskId, updates) => {
    await delay(300);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return { success: true, data: tasks[taskIndex] };
    }
    return { success: false, message: 'Task not found' };
  },

  updateTaskStatus: async (taskId, status, updatedTill) => {
    await delay(300);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        status,
        updatedTill,
        approvalStatus: 'pending',
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return { success: true, data: tasks[taskIndex] };
    }
    return { success: false, message: 'Task not found' };
  },

  approveTask: async (taskId, approvalStatus) => {
    await delay(300);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        approvalStatus,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return { success: true, data: tasks[taskIndex] };
    }
    return { success: false, message: 'Task not found' };
  },

  deleteTask: async (taskId) => {
    await delay(300);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      return { success: true };
    }
    return { success: false, message: 'Task not found' };
  },

  getClientReport: async (clientId) => {
    await delay(500);
    const clientTasks = tasks.filter(t => t.clientId === clientId);
    const client = clients.find(c => c.id === clientId);

    const groupedTasks = {};
    clientTasks.forEach(task => {
      if (!groupedTasks[task.taskCategory]) {
        groupedTasks[task.taskCategory] = [];
      }
      groupedTasks[task.taskCategory].push({
        ...task,
        employeeName: users.find(u => u.id === task.assignedTo)?.name || 'Unassigned'
      });
    });

    return {
      success: true,
      data: {
        client,
        tasks: groupedTasks,
        generatedAt: new Date().toISOString()
      }
    };
  }
};
