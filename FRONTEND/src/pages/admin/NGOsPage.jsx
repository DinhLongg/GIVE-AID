import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllNGOs,
  createNGO,
  updateNGO,
  deleteNGO,
} from '../../services/adminServices';

const NGOsPage = () => {
  const [ngos, setNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ngoToDelete, setNgoToDelete] = useState(null);
  const [editingNGO, setEditingNGO] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
    website: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNGOs();
  }, []);

  const loadNGOs = async () => {
    setLoading(true);
    const result = await getAllNGOs();
    if (result.success) {
      setNGOs(result.data || []);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const handleCreateClick = () => {
    setEditingNGO(null);
    setFormData({
      name: '',
      description: '',
      logoUrl: '',
      website: '',
    });
    setShowModal(true);
  };

  const handleEditClick = (ngo) => {
    setEditingNGO(ngo);
    setFormData({
      name: ngo.name || '',
      description: ngo.description || '',
      logoUrl: ngo.logoUrl || '',
      website: ngo.website || '',
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
    const ngoData = {
      name: formData.name,
      description: formData.description || '',
      logoUrl: formData.logoUrl || '',
      website: formData.website || '',
    };

    if (editingNGO) {
      const result = await updateNGO(editingNGO.id, ngoData);
      if (result.success) {
        toast.success(result.message);
        setShowModal(false);
        setEditingNGO(null);
        await loadNGOs();
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await createNGO(ngoData);
      if (result.success) {
        toast.success('NGO created successfully');
        setShowModal(false);
        setFormData({
          name: '',
          description: '',
          logoUrl: '',
          website: '',
        });
        await loadNGOs();
      } else {
        toast.error(result.message);
      }
    }
    setSaving(false);
  };

  const handleDeleteClick = (ngo) => {
    setNgoToDelete(ngo);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!ngoToDelete) return;

    const result = await deleteNGO(ngoToDelete.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteModal(false);
      setNgoToDelete(null);
      await loadNGOs();
    } else {
      toast.error(result.message);
    }
  };

  const filteredNGOs = ngos.filter((ngo) => {
    return (
      ngo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.website?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h2>NGOs Management</h2>
        <button className="btn btn-primary" onClick={handleCreateClick}>
          <i className="fas fa-plus me-2"></i>Create NGO
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
                placeholder="Search by name, description, or website..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3 text-end">
              <button className="btn btn-primary" onClick={loadNGOs}>
                <i className="fas fa-sync-alt me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NGOs Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Website</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNGOs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No NGOs found
                    </td>
                  </tr>
                ) : (
                  filteredNGOs.map((ngo) => (
                    <tr key={ngo.id}>
                      <td>{ngo.id}</td>
                      <td>
                        {ngo.logoUrl ? (
                          <img
                            src={ngo.logoUrl}
                            alt={ngo.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '50px',
                              height: '50px',
                              backgroundColor: '#e9ecef',
                              borderRadius: '5px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <i className="fas fa-building text-muted"></i>
                          </div>
                        )}
                      </td>
                      <td>{ngo.name}</td>
                      <td>
                        <div
                          style={{
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={ngo.description}
                        >
                          {ngo.description || 'N/A'}
                        </div>
                      </td>
                      <td>
                        {ngo.website ? (
                          <a href={ngo.website} target="_blank" rel="noopener noreferrer">
                            {ngo.website}
                            <i className="fas fa-external-link-alt ms-1"></i>
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        {ngo.createdAt
                          ? new Date(ngo.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEditClick(ngo)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteClick(ngo)}
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingNGO ? 'Edit NGO' : 'Create NGO'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingNGO(null);
                    setFormData({
                      name: '',
                      description: '',
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
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                          style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '5px' }}
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
                      setEditingNGO(null);
                      setFormData({
                        name: '',
                        description: '',
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
                    ) : editingNGO ? (
                      'Update NGO'
                    ) : (
                      'Create NGO'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && ngoToDelete && (
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
                    setNgoToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete NGO <strong>{ngoToDelete.name}</strong>?
                </p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setNgoToDelete(null);
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

export default NGOsPage;

