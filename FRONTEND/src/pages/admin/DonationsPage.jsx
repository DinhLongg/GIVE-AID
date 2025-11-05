import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllDonations, getDonation } from '../../services/adminServices';

const DonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    setLoading(true);
    const result = await getAllDonations();
    if (result.success) {
      setDonations(result.data || []);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleViewDonation = async (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
    
    // Load full details if needed
    if (!donation.user) {
      setLoadingDetail(true);
      const result = await getDonation(donation.id);
      if (result.success) {
        setSelectedDonation(result.data);
      }
      setLoadingDetail(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.causeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.transactionReference?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'success' && donation.paymentStatus === 'Success') ||
      (filterStatus === 'pending' && donation.paymentStatus === 'Pending') ||
      (filterStatus === 'failed' && donation.paymentStatus === 'Failed');

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalDonations = donations.length;
  const totalAmount = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const successDonations = donations.filter((d) => d.paymentStatus === 'Success').length;
  const successAmount = donations
    .filter((d) => d.paymentStatus === 'Success')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

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
        <h2>Donations Management</h2>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2">Total Donations</h6>
              <h3 className="card-title">{totalDonations}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2">Successful</h6>
              <h3 className="card-title">{successDonations}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6 className="card-subtitle mb-2">Total Amount</h6>
              <h3 className="card-title">{formatCurrency(totalAmount)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h6 className="card-subtitle mb-2">Success Amount</h6>
              <h3 className="card-title">{formatCurrency(successAmount)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by donor name, email, cause, or transaction ID..."
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
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="col-md-3 text-end">
              <button className="btn btn-primary" onClick={loadDonations}>
                <i className="fas fa-sync-alt me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Donor</th>
                  <th>Email</th>
                  <th>Cause</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      No donations found
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((donation) => (
                    <tr key={donation.id}>
                      <td>{donation.id}</td>
                      <td>
                        {donation.isAnonymous ? (
                          <span className="text-muted">
                            <i className="fas fa-user-secret me-1"></i>Anonymous
                          </span>
                        ) : (
                          donation.donorName || donation.user?.fullName || 'N/A'
                        )}
                      </td>
                      <td>
                        {donation.isAnonymous ? (
                          <span className="text-muted">-</span>
                        ) : (
                          donation.donorEmail || donation.user?.email || 'N/A'
                        )}
                      </td>
                      <td>
                        <div
                          style={{
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={donation.causeName}
                        >
                          {donation.causeName}
                        </div>
                      </td>
                      <td>
                        <strong className="text-success">{formatCurrency(donation.amount)}</strong>
                      </td>
                      <td>{donation.paymentMethod || 'Card'}</td>
                      <td>
                        {donation.paymentStatus === 'Success' ? (
                          <span className="badge bg-success">
                            <i className="fas fa-check me-1"></i>Success
                          </span>
                        ) : donation.paymentStatus === 'Pending' ? (
                          <span className="badge bg-warning text-dark">
                            <i className="fas fa-clock me-1"></i>Pending
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            <i className="fas fa-times me-1"></i>Failed
                          </span>
                        )}
                      </td>
                      <td>
                        <code style={{ fontSize: '0.85em' }}>
                          {donation.transactionReference || 'N/A'}
                        </code>
                      </td>
                      <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleViewDonation(donation)}
                        >
                          <i className="fas fa-eye me-1"></i>View
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

      {/* View Details Modal */}
      {showModal && selectedDonation && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Donation Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDonation(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {loadingDetail ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Donation ID:</strong> {selectedDonation.id}
                      </div>
                      <div className="col-md-6">
                        <strong>Transaction Reference:</strong>{' '}
                        <code>{selectedDonation.transactionReference || 'N/A'}</code>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Amount:</strong>{' '}
                        <span className="text-success fw-bold fs-5">
                          {formatCurrency(selectedDonation.amount)}
                        </span>
                      </div>
                      <div className="col-md-6">
                        <strong>Payment Status:</strong>{' '}
                        {selectedDonation.paymentStatus === 'Success' ? (
                          <span className="badge bg-success">Success</span>
                        ) : selectedDonation.paymentStatus === 'Pending' ? (
                          <span className="badge bg-warning text-dark">Pending</span>
                        ) : (
                          <span className="badge bg-danger">Failed</span>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Cause:</strong> {selectedDonation.causeName}
                      </div>
                      <div className="col-md-6">
                        <strong>Payment Method:</strong> {selectedDonation.paymentMethod || 'Card'}
                      </div>
                    </div>
                    <hr />
                    <h6 className="mb-3">Donor Information</h6>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Name:</strong>{' '}
                        {selectedDonation.isAnonymous ? (
                          <span className="text-muted">
                            <i className="fas fa-user-secret me-1"></i>Anonymous
                          </span>
                        ) : (
                          selectedDonation.donorName || selectedDonation.user?.fullName || 'N/A'
                        )}
                      </div>
                      <div className="col-md-6">
                        <strong>Email:</strong>{' '}
                        {selectedDonation.isAnonymous ? (
                          <span className="text-muted">-</span>
                        ) : (
                          selectedDonation.donorEmail || selectedDonation.user?.email || 'N/A'
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Phone:</strong> {selectedDonation.donorPhone || 'N/A'}
                      </div>
                      <div className="col-md-6">
                        <strong>Address:</strong> {selectedDonation.donorAddress || 'N/A'}
                      </div>
                    </div>
                    {selectedDonation.user && (
                      <div className="row mb-3">
                        <div className="col-12">
                          <strong>Registered User:</strong>{' '}
                          <span className="badge bg-info">
                            {selectedDonation.user.fullName || selectedDonation.user.email} (ID: {selectedDonation.user.id})
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Anonymous:</strong>{' '}
                        {selectedDonation.isAnonymous ? (
                          <span className="badge bg-secondary">Yes</span>
                        ) : (
                          <span className="badge bg-light text-dark">No</span>
                        )}
                      </div>
                      <div className="col-md-6">
                        <strong>Newsletter:</strong>{' '}
                        {selectedDonation.subscribeNewsletter ? (
                          <span className="badge bg-success">Subscribed</span>
                        ) : (
                          <span className="badge bg-light text-dark">Not Subscribed</span>
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-md-6">
                        <strong>Created At:</strong>{' '}
                        {new Date(selectedDonation.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDonation(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsPage;

