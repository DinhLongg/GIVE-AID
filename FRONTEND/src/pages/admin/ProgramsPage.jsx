import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../../services/adminServices';
import { getAllNGOs } from '../../services/adminServices';

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [ngos, setNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    ngoId: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrograms();
    loadNGOs();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    const result = await getAllPrograms();
    if (result.success) {
      setPrograms(result.data || []);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  const loadNGOs = async () => {
    const result = await getAllNGOs();
    if (result.success) {
      setNGOs(result.data || []);
    }
  };

  const handleCreateClick = () => {
    setEditingProgram(null);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      ngoId: '',
    });
    setShowModal(true);
  };

  const handleEditClick = (program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title || '',
      description: program.description || '',
      startDate: program.startDate ? new Date(program.startDate).toISOString().split('T')[0] : '',
      endDate: program.endDate ? new Date(program.endDate).toISOString().split('T')[0] : '',
      location: program.location || '',
      ngoId: program.ngoId || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.ngoId) {
      toast.error('Title and NGO are required');
      return;
    }

    setSaving(true);
    const programData = {
      title: formData.title,
      description: formData.description || '',
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      location: formData.location || '',
      ngoId: parseInt(formData.ngoId),
    };

    if (editingProgram) {
      const result = await updateProgram(editingProgram.id, programData);
      if (result.success) {
        toast.success(result.message);
        setShowModal(false);
        setEditingProgram(null);
        await loadPrograms();
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await createProgram(programData);
      if (result.success) {
        toast.success('Program created successfully');
        setShowModal(false);
        setFormData({
          title: '',
          description: '',
          startDate: '',
          endDate: '',
          location: '',
          ngoId: '',
        });
        await loadPrograms();
      } else {
        toast.error(result.message);
      }
    }
    setSaving(false);
  };

  const handleDeleteClick = (program) => {
    setProgramToDelete(program);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!programToDelete) return;

    const result = await deleteProgram(programToDelete.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteModal(false);
      setProgramToDelete(null);
      await loadPrograms();
    } else {
      toast.error(result.message);
    }
  };

  const filteredPrograms = programs.filter((program) => {
    return (
      program.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.ngo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h2>Programs Management</h2>
        <button className="btn btn-primary" onClick={handleCreateClick}>
          <i className="fas fa-plus me-2"></i>Create Program
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
                placeholder="Search by title, description, location, or NGO..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3 text-end">
              <button className="btn btn-primary" onClick={loadPrograms}>
                <i className="fas fa-sync-alt me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>NGO</th>
                  <th>Location</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No programs found
                    </td>
                  </tr>
                ) : (
                  filteredPrograms.map((program) => (
                    <tr key={program.id}>
                      <td>{program.id}</td>
                      <td>{program.title}</td>
                      <td>
                        <div
                          style={{
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={program.description}
                        >
                          {program.description || 'N/A'}
                        </div>
                      </td>
                      <td>{program.ngo?.name || 'N/A'}</td>
                      <td>{program.location || 'N/A'}</td>
                      <td>
                        {program.startDate
                          ? new Date(program.startDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        {program.endDate
                          ? new Date(program.endDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleEditClick(program)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteClick(program)}
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
                  {editingProgram ? 'Edit Program' : 'Create Program'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProgram(null);
                    setFormData({
                      title: '',
                      description: '',
                      startDate: '',
                      endDate: '',
                      location: '',
                      ngoId: '',
                    });
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        NGO <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={formData.ngoId}
                        onChange={(e) => setFormData({ ...formData, ngoId: e.target.value })}
                        required
                      >
                        <option value="">Select NGO</option>
                        {ngos.map((ngo) => (
                          <option key={ngo.id} value={ngo.id}>
                            {ngo.name}
                          </option>
                        ))}
                      </select>
                      {ngos.length === 0 && (
                        <small className="form-text text-danger">
                          No NGOs available. Please create an NGO first.
                        </small>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProgram(null);
                      setFormData({
                        title: '',
                        description: '',
                        startDate: '',
                        endDate: '',
                        location: '',
                        ngoId: '',
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
                    ) : editingProgram ? (
                      'Update Program'
                    ) : (
                      'Create Program'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && programToDelete && (
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
                    setProgramToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete program <strong>{programToDelete.title}</strong>?
                </p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProgramToDelete(null);
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

export default ProgramsPage;

