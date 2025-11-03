import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllPartners,
  createPartner,
  updatePartner,
  deletePartner,
} from '../../services/adminServices';

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    website: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    setLoading(true);
    const result = await getAllPartners();
    if (result.success) {
      setPartners(result.data || []);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleCreateClick = () => {
    setEditingPartner(null);
    setFormData({
      name: '',
      logoUrl: '',
      website: '',
    });
    setShowModal(true);
  };

  const handleEditClick = (partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name || '',
      logoUrl: partner.logoUrl || '',
      website: partner.website || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }

    setSaving(true);
    const partnerData = {
      name: formData.name,
      logoUrl: formData.logoUrl || '',
      website: formData.website || '',
    };

    if (editingPartner) {
      const result = await updatePartner(editingPartner.id, partnerData);
      if (result.success) {
        toast.success(result.message);
        setShowModal(false);
        setEditingPartner(null);
        await loadPartners();
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await createPartner(partnerData);
      if (result.success) {
        toast.success('Partner created successfully');
        setShowModal(false);
        setFormData({
          name: '',
          logoUrl: '',
          website: '',
        });
        await loadPartners();
      } else {
        toast.error(result.message);
      }
    }
    setSaving(false);
  };

  const handleDeleteClick = (partner) => {
    setPartnerToDelete(partner);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!partnerToDelete) return;

    const result = await deletePartner(partnerToDelete.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteModal(false);
      setPartnerToDelete(null);
      await loadPartners();
    } else {
      toast.error(result.message);
    }
  };

  const filteredPartners = partners.filter((partner) => {
    return (
      partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.website?.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
        <h2>Partners Management</h2>
        <button className="btn btn-primary" onClick={handleCreateClick}>
          <i className="fas fa-plus me-2"></i>Create Partner
        </button>
      </div>

      {/* Search */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or website..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3 text-end">
              <button className="btn btn-primary" onClick={loadPartners}>
                <i className="fas fa-sync-alt me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      <div className="card">
        <div className="card-body">
          {filteredPartners.length === 0 ? (
            <div className="text-center py-5">
              <p>No partners found</p>
            </div>
          ) : (
            <div className="row g-3">
              {filteredPartners.map((partner) => (
                <div key={partner.id} className="col-md-4 col-lg-3">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      {partner.logoUrl ? (
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="img-fluid mb-3"
                          style={{ maxHeight: '100px', objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div style={{ display: partner.logoUrl ? 'none' : 'block', marginBottom: '1rem' }}>
                        <i className="fas fa-building fa-3x text-muted"></i>
                      </div>
                      <h5 className="card-title">{partner.name}</h5>
                      {partner.website && (
                        <p className="card-text">
                          <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            Visit Website
                            <i className="fas fa-external-link-alt ms-1"></i>
                          </a>
                        </p>
                      )}
                      <div className="btn-group w-100" role="group">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleEditClick(partner)}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteClick(partner)}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingPartner ? 'Edit Partner' : 'Create Partner'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPartner(null);
                    setFormData({
                      name: '',
                      logoUrl: '',
                      website: '',
                    });
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Logo URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      placeholder="https://example.com/logo.png"
                    />
                    {formData.logoUrl && (
                      <div className="mt-2">
                        <img
                          src={formData.logoUrl}
                          alt="Preview"
                          style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain', borderRadius: '5px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingPartner(null);
                      setFormData({
                        name: '',
                        logoUrl: '',
                        website: '',
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : editingPartner ? (
                      'Update Partner'
                    ) : (
                      'Create Partner'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && partnerToDelete && (
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
                    setPartnerToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete partner <strong>{partnerToDelete.name}</strong>?
                </p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPartnerToDelete(null);
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

export default PartnersPage;

