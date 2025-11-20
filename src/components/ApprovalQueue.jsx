import { useState, useEffect } from 'react';
import { mockApi } from '../services/mockApi';

const ApprovalQueue = ({ onApprovalChange }) => {
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPendingTasks();
  }, []);

  const loadPendingTasks = async () => {
    setLoading(true);
    const response = await mockApi.getTasks({ approvalStatus: 'pending' });
    if (response.success) {
      setPendingTasks(response.data.filter(t => t.status !== 'pending'));
    }
    setLoading(false);
  };

  const handleApproval = async (taskId, approvalStatus) => {
    const response = await mockApi.approveTask(taskId, approvalStatus);
    if (response.success) {
      loadPendingTasks();
      onApprovalChange();
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'badge-pending',
      in_progress: 'badge-progress',
      completed: 'badge-completed'
    };
    return statusColors[status] || 'badge-pending';
  };

  return (
    <div className="approval-queue">
      <h2>Pending Approvals</h2>

      {loading ? (
        <p>Loading...</p>
      ) : pendingTasks.length === 0 ? (
        <p className="no-tasks">No pending approvals</p>
      ) : (
        <div className="table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Category</th>
                <th>Task Name</th>
                <th>Employee</th>
                <th>Status</th>
                <th>Updated Till</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingTasks.map(task => (
                <tr key={task.id}>
                  <td>{task.clientName}</td>
                  <td>{task.taskCategory}</td>
                  <td>{task.taskName}</td>
                  <td>{task.employeeName}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{task.updatedTill || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleApproval(task.id, 'approved')}
                        className="approve-btn"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(task.id, 'rejected')}
                        className="reject-btn"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;
