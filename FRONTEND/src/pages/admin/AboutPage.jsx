import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getAboutSection,
  createAboutSection,
  updateAboutSection,
} from '../../services/adminServices';

const AboutPage = () => {
  const [sections, setSections] = useState([
    { key: 'whatwedo', label: 'What We Do', title: 'What We Do' },
    { key: 'mission', label: 'Our Mission', title: 'Our Mission' },
    { key: 'ourteam', label: 'Our Team', title: 'Our Team' },
    { key: 'career', label: 'Career with Us', title: 'Career with Us' },
    { key: 'achievements', label: 'Our Achievements', title: 'Our Achievements' },
    { key: 'supporters', label: 'Our Supporters', title: 'Our Supporters' },
    { key: 'readaboutus', label: 'Read About Us', title: 'Read About Us' },
  ]);
  const [loading, setLoading] = useState(true);
  const [sectionData, setSectionData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    key: '',
    title: '',
    content: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    setLoading(true);
    const loadedData = {};
    
    for (const section of sections) {
      const result = await getAboutSection(section.key);
      if (result.success && result.data) {
        loadedData[section.key] = result.data;
      }
    }
    
    setSectionData(loadedData);
    setLoading(false);
  };

  const handleEditClick = async (section) => {
    const existingData = sectionData[section.key];
    if (existingData) {
      setEditingSection(existingData);
      setFormData({
        key: existingData.key,
        title: existingData.title || section.title,
        content: existingData.content || '',
      });
    } else {
      setEditingSection(null);
      setFormData({
        key: section.key,
        title: section.title,
        content: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.key || !formData.title) {
      toast.error('Key and title are required');
      return;
    }

    setSaving(true);
    const sectionData = {
      key: formData.key,
      title: formData.title,
      content: formData.content || '',
    };

    if (editingSection) {
      const result = await updateAboutSection(editingSection.id, sectionData);
      if (result.success) {
        toast.success(result.message);
        setShowModal(false);
        setEditingSection(null);
        await loadSections();
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await createAboutSection(sectionData);
      if (result.success) {
        toast.success('About section created successfully');
        setShowModal(false);
        setEditingSection(null);
        setFormData({
          key: '',
          title: '',
          content: '',
        });
        await loadSections();
      } else {
        toast.error(result.message);
      }
    }
    setSaving(false);
  };

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
        <h2>About Sections Management</h2>
        <button className="btn btn-primary" onClick={loadSections}>
          <i className="fas fa-sync-alt me-2"></i>Refresh
        </button>
      </div>

      {/* Sections Grid */}
      <div className="row g-3">
        {sections.map((section) => {
          const data = sectionData[section.key];
          const hasContent = data && data.content;

          return (
            <div key={section.key} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="fas fa-file-alt me-2 text-primary"></i>
                    {section.label}
                  </h5>
                  <p className="card-text">
                    {hasContent ? (
                      <span className="text-success">
                        <i className="fas fa-check-circle me-1"></i>
                        Content exists
                      </span>
                    ) : (
                      <span className="text-muted">
                        <i className="fas fa-exclamation-circle me-1"></i>
                        No content yet
                      </span>
                    )}
                  </p>
                  {hasContent && (
                    <div className="mb-2">
                      <small className="text-muted">
                        <strong>Title:</strong> {data.title}
                      </small>
                    </div>
                  )}
                  <button
                    className="btn btn-sm btn-primary w-100"
                    onClick={() => handleEditClick(section)}
                  >
                    <i className="fas fa-edit me-1"></i>
                    {hasContent ? 'Edit Content' : 'Add Content'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingSection ? 'Edit About Section' : 'Create About Section'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSection(null);
                    setFormData({
                      key: '',
                      title: '',
                      content: '',
                    });
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Section Key <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.key}
                      disabled
                      readOnly
                    />
                    <small className="form-text text-muted">
                      This is the unique identifier for this section
                    </small>
                  </div>
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
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      rows="10"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Enter the content for this section. HTML is supported."
                    />
                    <small className="form-text text-muted">
                      You can use HTML tags to format the content
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingSection(null);
                      setFormData({
                        key: '',
                        title: '',
                        content: '',
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
                    ) : editingSection ? (
                      'Update Section'
                    ) : (
                      'Create Section'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;

