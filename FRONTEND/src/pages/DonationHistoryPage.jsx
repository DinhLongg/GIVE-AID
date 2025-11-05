import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import donationService from '../services/donationServices';
import { toast } from 'react-toastify';

export default function DonationHistoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load donations
  useEffect(() => {
    if (isAuthenticated) {
      loadDonations();
    }
  }, [isAuthenticated]);

  const loadDonations = async () => {
    setLoading(true);
    try {
      const data = await donationService.getMyDonations();
      setDonations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load donations:', error);
      toast.error('Failed to load donation history. Please try again.');
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDonation = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  // Calculate statistics
  const totalDonations = donations.length;
  const totalAmount = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const successDonations = donations.filter((d) => d.paymentStatus === 'Success').length;
  const successAmount = donations
    .filter((d) => d.paymentStatus === 'Success')
    .reduce((sum, d) => sum + Number(d.amount || 0), 0);

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Donation History</h2>
        <button className="btn btn-primary" onClick={() => navigate('/donate')}>
          <i className="fas fa-heart me-2"></i>Make a Donation
        </button>
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

      {/* Donations List */}
      <div className="card">
        <div className="card-body">
          {donations.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No donations yet</h5>
              <p className="text-muted">Start making a difference by making your first donation!</p>
              <button className="btn btn-primary mt-3" onClick={() => navigate('/donate')}>
                <i className="fas fa-heart me-2"></i>Make Your First Donation
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cause/Program</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.id}>
                      <td>{donation.id}</td>
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
                      <td>{formatDate(donation.createdAt)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleViewDonation(donation)}
                        >
                          <i className="fas fa-eye me-1"></i>View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedDonation && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setSelectedDonation(null);
            }
          }}
        >
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
                    <strong>Cause/Program:</strong> {selectedDonation.causeName}
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
                      selectedDonation.donorName || 'N/A'
                    )}
                  </div>
                  <div className="col-md-6">
                    <strong>Email:</strong>{' '}
                    {selectedDonation.isAnonymous ? (
                      <span className="text-muted">-</span>
                    ) : (
                      selectedDonation.donorEmail || 'N/A'
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
                    <strong>Created At:</strong> {formatDate(selectedDonation.createdAt)}
                  </div>
                </div>
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
}

