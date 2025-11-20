import { useState, useEffect } from 'react';
import { taskService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskAssignment from '../components/TaskAssignment';
import TaskList from '../components/TaskList';
import ApprovalQueue from '../components/ApprovalQueue';
import ClientReports from '../components/ClientReports';
import '../styles/Dashboard.css';
import '../services/mockApi'
import { mockApi } from '../services/mockApi';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // const response = await taskService.getTasks();
      const response = await mockApi.getTasks(); // Using mock API
      if (response.success) {
        setTasks(response.data);
      } else {
        setError(response.message || 'Failed to load tasks');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while loading tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'tasks' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('tasks')}
        >
          All Tasks
        </button>
        <button
          className={activeTab === 'assign' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('assign')}
        >
          Assign Task
        </button>
        <button
          className={activeTab === 'approvals' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('approvals')}
        >
          Approvals
        </button>
        <button
          className={activeTab === 'reports' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="dashboard-content">
        {loading && <div className="loading">Loading...</div>}
        {!loading && activeTab === 'tasks' && (
          <TaskList tasks={tasks} onRefresh={loadTasks} isAdmin={true} />
        )}
        {!loading && activeTab === 'assign' && (
          <TaskAssignment onTaskCreated={loadTasks} />
        )}
        {!loading && activeTab === 'approvals' && (
          <ApprovalQueue onApprovalChange={loadTasks} />
        )}
        {!loading && activeTab === 'reports' && (
          <ClientReports />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
