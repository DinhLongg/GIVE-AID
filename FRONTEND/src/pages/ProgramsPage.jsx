import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import programService from "../services/programServices";
import { useAuth } from "../contexts/AuthContext";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [programStats, setProgramStats] = useState({}); // { programId: { totalDonations, progressPercentage } }
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await programService.getAll();
        setPrograms(data || []);
        
        // Fetch stats for each program
        const statsPromises = (data || []).map(async (program) => {
          try {
            const stats = await programService.getStats(program.id);
            return { programId: program.id, stats };
          } catch (error) {
            console.error(`Failed to load stats for program ${program.id}:`, error);
            return { programId: program.id, stats: null };
          }
        });
        
        const statsResults = await Promise.all(statsPromises);
        const statsMap = {};
        statsResults.forEach(({ programId, stats }) => {
          statsMap[programId] = stats;
        });
        setProgramStats(statsMap);
      } catch (error) {
        toast.error("Failed to load programs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleRegister = async (programId) => {
    if (!user) {
      toast.warn("Please login to register!");
      return;
    }
    try {
      await programService.register({ programId, fullName: user.fullName, email: user.email });
      toast.success("Registered successfully!");
      
      // Refresh stats to update registration count
      try {
        const stats = await programService.getStats(programId);
        setProgramStats(prev => ({
          ...prev,
          [programId]: stats
        }));
      } catch (error) {
        console.error("Failed to refresh stats:", error);
      }
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

                      {/* Progress Bar */}
                      {programStats[p.id] && programStats[p.id].goalAmount && (
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">
                              {formatCurrency(programStats[p.id].totalDonations || 0)} raised
                            </small>
                            <small className="text-muted">
                              {Math.round(programStats[p.id].progressPercentage || 0)}%
                            </small>
                </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div
                              className="progress-bar bg-success"
                        role="progressbar"
                              style={{ width: `${Math.min(programStats[p.id].progressPercentage || 0, 100)}%` }}
                      ></div>
                    </div>
                          <small className="text-muted">
                            Goal: {formatCurrency(programStats[p.id].goalAmount)}
                          </small>
                  </div>
                      )}
                      
                      {/* Registration Count */}
                      {programStats[p.id] && programStats[p.id].registrationCount !== undefined && (
                        <div className="mb-3">
                          <small className="text-muted">
                            <i className="fas fa-users me-1"></i>
                            <strong>{programStats[p.id].registrationCount || 0}</strong> {programStats[p.id].registrationCount === 1 ? 'person' : 'people'} registered
                          </small>
                        </div>
                      )}
                      
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
