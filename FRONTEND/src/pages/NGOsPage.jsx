import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ngoService from "../services/ngoServices";
import PageBanner from "../components/PageBanner";

export default function NGOsPage() {
  const [ngos, setNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNGO, setSelectedNGO] = useState(null);

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const data = await ngoService.getAll(true); // Include programs
        setNGOs(data || []);
      } catch (error) {
        toast.error("Failed to load NGOs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchNGOs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5" style={{ marginTop: "80px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <PageBanner
        title="Our Partner NGOs"
        subtitle="Discover the organizations working with us to create positive change."
        eyebrowText="Community Allies"
        accent="primary"
      />

      {/* NGOs List */}
      <section className="py-5">
        <div className="container">
          {ngos.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="fas fa-building fa-3x mb-3 text-muted"></i>
              <p>No NGOs found.</p>
            </div>
          ) : (
            <div className="row g-4">
              {ngos.map((ngo) => (
                <div className="col-md-6 col-lg-4" key={ngo.id} data-aos="fade-up">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column">
                      {/* NGO Logo */}
                      {ngo.logoUrl ? (
                        <div className="text-center mb-3">
                          <img
                            src={ngo.logoUrl}
                            alt={ngo.name}
                            className="img-fluid"
                            style={{ maxHeight: "100px", maxWidth: "100%", objectFit: "contain" }}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-center mb-3">
                          <div
                            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                            style={{ width: "80px", height: "80px" }}
                          >
                            <i className="fas fa-building fa-2x"></i>
                          </div>
                        </div>
                      )}

                      <h5 className="card-title text-center mb-2">{ngo.name}</h5>
                      
                      <p className="card-text flex-grow-1" style={{ minHeight: "60px" }}>
                        {ngo.description || "No description available."}
                      </p>

                      {/* Programs Count */}
                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="fas fa-list-alt me-1"></i>
                          {ngo.ngoPrograms?.length || 0} Program(s)
                        </small>
                      </div>

                      {/* Website Link */}
                      {ngo.website && (
                        <div className="mb-3">
                          <a
                            href={ngo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary w-100"
                          >
                            <i className="fas fa-external-link-alt me-2"></i>
                            Visit Website
                          </a>
                        </div>
                      )}

                      {/* View Programs Button */}
                      {ngo.ngoPrograms && ngo.ngoPrograms.length > 0 && (
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => setSelectedNGO(ngo)}
                        >
                          <i className="fas fa-eye me-2"></i>
                          View Programs
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Programs Modal */}
      {selectedNGO && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNGO(null);
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">
                  Programs by {selectedNGO.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setSelectedNGO(null)}
                ></button>
              </div>
              <div className="modal-body">
                {selectedNGO.ngoPrograms && selectedNGO.ngoPrograms.length > 0 ? (
                  <div className="list-group">
                    {selectedNGO.ngoPrograms.map((program) => (
                      <div key={program.id} className="list-group-item">
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{program.title}</h6>
                        </div>
                        <p className="mb-1">{program.description || "No description."}</p>
                        <div className="d-flex justify-content-between align-items-center text-muted small">
                          <span>
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {program.location || "Nationwide"}
                          </span>
                          <span>
                            {program.startDate
                              ? new Date(program.startDate).toLocaleDateString()
                              : ""}
                            {program.endDate
                              ? ` - ${new Date(program.endDate).toLocaleDateString()}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-center">No programs available.</p>
                )}
              </div>
              <div className="modal-footer">
                <Link to="/programs" className="btn btn-primary" onClick={() => setSelectedNGO(null)}>
                  View All Programs
                </Link>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedNGO(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

