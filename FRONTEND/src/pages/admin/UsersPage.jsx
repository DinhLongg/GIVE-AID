import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllUsers, getUser, updateUserRole, deleteUser } from '../../services/adminServices';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.data || []);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleViewUser = async (id) => {
    const result = await getUser(id);
    if (result.success) {
      setSelectedUser(result.data);
      setShowModal(true);
    } else {
      toast.error(result.message);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      toast.success(result.message);
      await loadUsers();
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    const result = await deleteUser(userToDelete.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteModal(false);
      setUserToDelete(null);
      if (selectedUser && selectedUser.id === userToDelete.id) {
        setShowModal(false);
        setSelectedUser(null);
      }
      await loadUsers();
    } else {
      toast.error(result.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users Management</h2>
      </div>

      {/* Search and Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by email, username, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <button className="btn btn-primary" onClick={loadUsers}>
                <i className="fas fa-sync-alt me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Email Verified</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullName || 'N/A'}</td>
                      <td>{user.username || 'N/A'}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'Admin' ? 'bg-danger' : 'bg-secondary'}`}>
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td>
                        {user.emailVerified ? (
                          <span className="badge bg-success">
                            <i className="fas fa-check me-1"></i>Verified
                          </span>
                        ) : (
                          <span className="badge bg-warning text-dark">
                            <i className="fas fa-times me-1"></i>Unverified
                          </span>
                        )}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-info text-white"
                            onClick={() => handleViewUser(user.id)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteClick(user)}
                            title="Delete User"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      {showModal && selectedUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>ID:</strong> {selectedUser.id}
                  </div>
                  <div className="col-md-6">
                    <strong>Email Verified:</strong>{' '}
                    {selectedUser.emailVerified ? (
                      <span className="badge bg-success">Yes</span>
                    ) : (
                      <span className="badge bg-warning text-dark">No</span>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Full Name:</strong> {selectedUser.fullName || 'N/A'}
                  </div>
                  <div className="col-md-6">
                    <strong>Username:</strong> {selectedUser.username || 'N/A'}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div className="col-md-6">
                    <strong>Phone:</strong> {selectedUser.phone || 'N/A'}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Address:</strong> {selectedUser.address || 'N/A'}
                  </div>
                  <div className="col-md-6">
                    <strong>Created At:</strong>{' '}
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mb-3">
                  <strong>Current Role:</strong>{' '}
                  <span className={`badge ${selectedUser.role === 'Admin' ? 'bg-danger' : 'bg-secondary'}`}>
                    {selectedUser.role || 'User'}
                  </span>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    <strong>Change Role:</strong>
                  </label>
                  <select
                    className="form-select"
                    value={selectedUser.role || 'User'}
                    onChange={(e) => handleUpdateRole(selectedUser.id, e.target.value)}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete user <strong>{userToDelete.email}</strong>?
                </p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;

