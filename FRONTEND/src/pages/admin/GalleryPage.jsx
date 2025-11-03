import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllGallery,
  createGallery,
  deleteGallery,
} from '../../services/adminServices';
import { getAllPrograms } from '../../services/adminServices';

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
    programId: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadGallery();
    loadPrograms();
  }, []);

  const loadGallery = async () => {
    setLoading(true);
    const result = await getAllGallery();
    if (result.success) {
      setGalleryItems(result.data || []);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const loadPrograms = async () => {
    const result = await getAllPrograms();
    if (result.success) {
      setPrograms(result.data || []);
    }
  };

  const handleCreateClick = () => {
    setFormData({
      imageUrl: '',
      caption: '',
      programId: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      toast.error('Image URL is required');
      return;
    }

    setSaving(true);
    const galleryData = {
      imageUrl: formData.imageUrl,
      caption: formData.caption || '',
      programId: formData.programId ? parseInt(formData.programId) : null,
    };

    const result = await createGallery(galleryData);
    if (result.success) {
      toast.success('Gallery item created successfully');
      setShowModal(false);
      setFormData({
        imageUrl: '',
        caption: '',
        programId: '',
      });
      await loadGallery();
    } else {
      toast.error(result.message);
    }
    setSaving(false);
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    const result = await deleteGallery(itemToDelete.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteModal(false);
      setItemToDelete(null);
      await loadGallery();
    } else {
      toast.error(result.message);
    }
  };

  const filteredItems = galleryItems.filter((item) => {
    return (
      item.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.program?.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h2>Gallery Management</h2>
        <button className="btn btn-primary" onClick={handleCreateClick}>
          <i className="fas fa-plus me-2"></i>Add Image
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
                placeholder="Search by caption or program..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3 text-end">
              <button className="btn btn-primary" onClick={loadGallery}>
                <i className="fas fa-sync-alt me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="card">
        <div className="card-body">
          {filteredItems.length === 0 ? (
            <div className="text-center py-5">
              <p>No gallery items found</p>
            </div>
          ) : (
            <div className="row g-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="col-md-4 col-lg-3">
                  <div className="card">
                    <img
                      src={item.imageUrl}
                      className="card-img-top"
                      alt={item.caption || 'Gallery image'}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                    <div className="card-body">
                      <p className="card-text">
                        <small className="text-muted">
                          {item.caption || 'No caption'}
                        </small>
                      </p>
                      {item.program && (
                        <p className="card-text">
                          <small>
                            <strong>Program:</strong> {item.program.title}
                          </small>
                        </p>
                      )}
                      <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <i className="fas fa-trash me-1"></i>Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Gallery Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({
                      imageUrl: '',
                      caption: '',
                      programId: '',
                    });
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Image URL <span className="text-danger">*</span>
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '5px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Caption</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.caption}
                      onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                      placeholder="Optional caption for the image"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Associated Program (Optional)</label>
                    <select
                      className="form-select"
                      value={formData.programId}
                      onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                    >
                      <option value="">None</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setFormData({
                        imageUrl: '',
                        caption: '',
                        programId: '',
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
                    ) : (
                      'Add Image'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
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
                    setItemToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this gallery item?</p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
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

export default GalleryPage;

