import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllGallery,
  createGallery,
  deleteGallery,
} from "../../services/adminServices";
import { getAllPrograms } from "../../services/adminServices";

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [uploadType, setUploadType] = useState("url"); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: "",
    caption: "",
    programId: "",
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
    setUploadType("url");
    setSelectedFile(null);
    setFilePreview(null);
    setFormData({
      imageUrl: "",
      caption: "",
      programId: "",
    });
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/jpeg",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Invalid file type. Only JPG, JPEG, PNG, GIF, and WEBP are allowed."
        );
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate based on upload type
    if (uploadType === "url" && !formData.imageUrl.trim()) {
      toast.error("Image URL is required");
      return;
    }

    if (uploadType === "file" && !selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setSaving(true);

    try {
      // Always use FormData for consistency with backend [FromForm] binding
      const formDataObj = new FormData();

      if (uploadType === "file" && selectedFile) {
        formDataObj.append("file", selectedFile);
      } else if (uploadType === "url" && formData.imageUrl.trim()) {
        formDataObj.append("imageUrl", formData.imageUrl.trim());
      }

      formDataObj.append("caption", formData.caption || "");
      if (formData.programId) {
        formDataObj.append("programId", formData.programId);
      }

      const result = await createGallery(formDataObj);
      if (result.success) {
        toast.success("Gallery item created successfully");
        setShowModal(false);
        setUploadType("url");
        setSelectedFile(null);
        setFilePreview(null);
        setFormData({
          imageUrl: "",
          caption: "",
          programId: "",
        });
        await loadGallery();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to create gallery item");
      console.error(error);
    } finally {
      setSaving(false);
    }
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
              {filteredItems.map((item) => {
                // If image is local upload (starts with /uploads/), prefix with backend base URL (without /api)
                const apiBase =
                  import.meta.env.VITE_API_BASE || "http://localhost:5230/api";
                const backendBase = apiBase.replace("/api", ""); // Remove /api to get backend root
                const imageSrc = item.imageUrl?.startsWith("/uploads/")
                  ? `${backendBase}${item.imageUrl}`
                  : item.imageUrl;

                return (
                  <div key={item.id} className="col-md-4 col-lg-3">
                    <div className="card">
                      <img
                        src={imageSrc}
                        className="card-img-top"
                        alt={item.caption || "Gallery image"}
                        style={{ height: "200px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Image+Not+Found";
                        }}
                      />
                      <div className="card-body">
                        <p className="card-text">
                          <small className="text-muted">
                            {item.caption || "No caption"}
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
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Gallery Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setUploadType("url");
                    setSelectedFile(null);
                    setFilePreview(null);
                    setFormData({
                      imageUrl: "",
                      caption: "",
                      programId: "",
                    });
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Upload Type Toggle */}
                  <div className="mb-3">
                    <label className="form-label">
                      Image Source <span className="text-danger">*</span>
                    </label>
                    <div className="btn-group w-100" role="group">
                      <input
                        type="radio"
                        className="btn-check"
                        name="uploadType"
                        id="uploadTypeUrl"
                        checked={uploadType === "url"}
                        onChange={() => {
                          setUploadType("url");
                          setSelectedFile(null);
                          setFilePreview(null);
                        }}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="uploadTypeUrl"
                      >
                        <i className="fas fa-link me-2"></i>Enter URL
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="uploadType"
                        id="uploadTypeFile"
                        checked={uploadType === "file"}
                        onChange={() => {
                          setUploadType("file");
                          setFormData({ ...formData, imageUrl: "" });
                        }}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="uploadTypeFile"
                      >
                        <i className="fas fa-upload me-2"></i>Upload File
                      </label>
                    </div>
                  </div>

                  {/* URL Input */}
                  {uploadType === "url" && (
                    <div className="mb-3">
                      <label className="form-label">
                        Image URL <span className="text-danger">*</span>
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        placeholder="https://example.com/image.jpg"
                        required={uploadType === "url"}
                      />
                      {formData.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "300px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* File Upload */}
                  {uploadType === "file" && (
                    <div className="mb-3">
                      <label className="form-label">
                        Select Image <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        required={uploadType === "file"}
                      />
                      <small className="form-text text-muted">
                        Supported formats: JPG, JPEG, PNG, GIF, WEBP (Max 5MB)
                      </small>
                      {filePreview && (
                        <div className="mt-2">
                          <img
                            src={filePreview}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "300px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                          />
                          {selectedFile && (
                            <p className="text-muted small mt-1">
                              File: {selectedFile.name} (
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Caption</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.caption}
                      onChange={(e) =>
                        setFormData({ ...formData, caption: e.target.value })
                      }
                      placeholder="Optional caption for the image"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Associated Program (Optional)
                    </label>
                    <select
                      className="form-select"
                      value={formData.programId}
                      onChange={(e) =>
                        setFormData({ ...formData, programId: e.target.value })
                      }
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
                      setUploadType("url");
                      setSelectedFile(null);
                      setFilePreview(null);
                      setFormData({
                        imageUrl: "",
                        caption: "",
                        programId: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      "Add Image"
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
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
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
