import { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';
import { clientService,employeeService, taskService } from '../services/api';

const TaskAssignment = ({ onTaskCreated }) => {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    clientId: '',
    taskCategory: '',
    taskName: '',
    assignedTo: '',
    createdBy: 1
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [clientsRes, employeesRes] = await Promise.all([
      clientService.getClients(),
      employeeService.getEmployees()
    ]);

    if (clientsRes.success) setClients(clientsRes.data);
    if (employeesRes.success) setEmployees(employeesRes.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const taskData = {
      ...formData,
      clientId: parseInt(formData.clientId),
      assignedTo: parseInt(formData.assignedTo)
    };

    const response = await taskService.createTask(taskData);
    if (response.success) {
      setMessage('Task assigned successfully!');
      setFormData({
        clientId: '',
        taskCategory: '',
        taskName: '',
        assignedTo: '',
        createdBy: 1
      });
      setTimeout(() => setMessage(''), 3000);
      onTaskCreated();
    } else {
      setMessage('Failed to create task');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="task-assignment">
      <h2>Assign New Task</h2>
      <form onSubmit={handleSubmit} className="assignment-form">
        <div className="form-row">
          <div className="form-group">
            <label>Client *</label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Task Category *</label>
            <input
              type="text"
              name="taskCategory"
              value={formData.taskCategory}
              onChange={handleChange}
              placeholder="e.g., Bank Statement, Return File, Audit"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Task Name *</label>
            <input
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
              placeholder="e.g., Bank A, GST Return"
              required
            />
          </div>

          <div className="form-group">
            <label>Assign To *</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {message && (
          <div className={message.includes('success') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Assigning...' : 'Assign Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskAssignment;
