import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import programService from "../services/programServices";
import { useAuth } from "../contexts/AuthContext";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await programService.getAll();
        setPrograms(data || []);
      } catch (error) {
        toast.error("Failed to load programs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleRegister = async (programId) => {
    if (!user) {
      toast.warn("Please login to register!");
      return;
    }
    try {
      await programService.register({ programId, fullName: user.fullName, email: user.email });
      toast.success("Registered successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <section className="py-5 bg-primary text-white" style={{ marginTop: "80px" }}>
        <div className="container text-center">
          <h1 className="fw-bold mb-2">Our Programs</h1>
          <p className="mb-0">Discover current initiatives and join with us.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center text-muted py-5">No programs found.</div>
          ) : (
            <div className="row g-4">
              {programs.map((p) => (
                <div className="col-md-6 col-lg-4" key={p.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title mb-2">{p.title}</h5>
                      <div className="text-muted small mb-2">
                        <i className="fas fa-building me-1"></i>
                        {p.ngo?.name || "NGO"}
                      </div>
                      <p className="card-text flex-grow-1" style={{ minHeight: 60 }}>
                        {p.description || "No description."}
                      </p>
                      <div className="d-flex justify-content-between align-items-center text-muted small mb-3">
                        <span><i className="fas fa-map-marker-alt me-1"></i>{p.location || "Nationwide"}</span>
                        <span>
                          {p.startDate ? new Date(p.startDate).toLocaleDateString() : ""}
                          {p.endDate ? ` - ${new Date(p.endDate).toLocaleDateString()}` : ""}
                        </span>
                      </div>
                      <button className="btn btn-primary w-100" onClick={() => handleRegister(p.id)}>
                        Register Interest
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
