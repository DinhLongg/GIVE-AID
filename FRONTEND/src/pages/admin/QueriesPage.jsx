import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllQueries, replyQuery } from '../../services/adminServices';

const QueriesPage = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    loadQueries();
  }, []);

  const loadQueries = async () => {
    setLoading(true);
    const result = await getAllQueries();
    if (result.success) {
      setQueries(result.data || []);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setReplyText(query.adminReply || '');
    setShowModal(true);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setReplying(true);
    const result = await replyQuery(selectedQuery.id, replyText);
    if (result.success) {
      toast.success(result.message);
      setShowModal(false);
      setSelectedQuery(null);
      setReplyText('');
      await loadQueries();
    } else {
      toast.error(result.message);
    }
    setReplying(false);
  };

  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'answered' && query.adminReply) ||
      (filterStatus === 'unanswered' && !query.adminReply);

    return matchesSearch && matchesStatus;
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
        <h2>Queries Management</h2>
      </div>

      {/* Search and Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by subject, message, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Queries</option>
                <option value="answered">Answered</option>
                <option value="unanswered">Unanswered</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <button className="btn btn-primary" onClick={loadQueries}>
                <i className="fas fa-sync-alt me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Queries Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Replied At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No queries found
                    </td>
                  </tr>
                ) : (
                  filteredQueries.map((query) => (
                    <tr key={query.id}>
                      <td>{query.id}</td>
                      <td>{query.user?.fullName || query.user?.email || 'Guest'}</td>
                      <td>{query.user?.email || 'N/A'}</td>
                      <td>{query.subject}</td>
                      <td>
                        <div
                          style={{
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={query.message}
                        >
                          {query.message}
                        </div>
                      </td>
                      <td>
                        {query.adminReply ? (
                          <span className="badge bg-success">
                            <i className="fas fa-check me-1"></i>Answered
                          </span>
                        ) : (
                          <span className="badge bg-warning text-dark">
                            <i className="fas fa-clock me-1"></i>Pending
                          </span>
                        )}
                      </td>
                      <td>{new Date(query.createdAt).toLocaleDateString()}</td>
                      <td>
                        {query.repliedAt
                          ? new Date(query.repliedAt).toLocaleDateString()
                          : '-'}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleViewQuery(query)}
                        >
                          <i className="fas fa-eye me-1"></i>View & Reply
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View & Reply Modal */}
      {showModal && selectedQuery && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Query Details & Reply</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedQuery(null);
                    setReplyText('');
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <strong>Query ID:</strong> {selectedQuery.id}
                </div>
                <div className="mb-3">
                  <strong>User:</strong> {selectedQuery.user?.fullName || selectedQuery.user?.email || 'Guest'}
                </div>
                <div className="mb-3">
                  <strong>Email:</strong> {selectedQuery.user?.email || 'N/A'}
                </div>
                <div className="mb-3">
                  <strong>Subject:</strong> {selectedQuery.subject}
                </div>
                <div className="mb-3">
                  <strong>Message:</strong>
                  <div className="border p-3 mt-2 rounded bg-light">
                    {selectedQuery.message}
                  </div>
                </div>
                <div className="mb-3">
                  <strong>Created At:</strong>{' '}
                  {new Date(selectedQuery.createdAt).toLocaleString()}
                </div>
                {selectedQuery.repliedAt && (
                  <div className="mb-3">
                    <strong>Replied At:</strong>{' '}
                    {new Date(selectedQuery.repliedAt).toLocaleString()}
                  </div>
                )}
                {selectedQuery.adminReply && (
                  <div className="mb-3">
                    <strong>Previous Reply:</strong>
                    <div className="border p-3 mt-2 rounded bg-light">
                      {selectedQuery.adminReply}
                    </div>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">
                    <strong>Admin Reply:</strong>
                  </label>
                  <textarea
                    className="form-control"
                    rows="6"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Enter your reply here..."
                  />
                  <small className="form-text text-muted">
                    This reply will be sent to the user via email.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedQuery(null);
                    setReplyText('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitReply}
                  disabled={replying || !replyText.trim()}
                >
                  {replying ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueriesPage;

