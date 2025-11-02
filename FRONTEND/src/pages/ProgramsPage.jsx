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
        setPrograms(data);
      } catch (error) {
        toast.error("Failed to load programs. Please try again.", error);
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
      const req = {
        programId,
        userId: user.id,
      };

      await programService.register(req);
      toast.success("You have successfully registered for this program!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };
  return (
    <>
      {/* Hero Section */}
      <section
        className="py-5 bg-primary text-white"
        style={{ marginTop: "80px" }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-3">Our Programs</h1>
              <p className="lead mb-0">
                Discover our initiatives making a difference in communities
                across the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs List */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">Active Programs</h2>
              <p className="lead text-muted">
                Join us in these meaningful programs that bring hope and
                opportunities to those in need.
              </p>
            </div>
          </div>

          {/* Education Programs */}
          <div className="row mb-5">
            <div className="col-12" data-aos="fade-up">
              <h3 className="fw-bold mb-4">
                <i className="fas fa-graduation-cap text-primary me-2"></i>
                Education Programs
              </h3>
            </div>

            <div
              className="col-lg-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="program-card h-100">
                <div className="program-image">
                  <img
                    src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Children Education"
                    className="img-fluid"
                  />
                </div>
                <div className="program-content">
                  <h5 className="program-title">Children Education Support</h5>
                  <p className="program-description">
                    Providing school supplies, books, and learning materials for
                    underprivileged children. This program aims to ensure every
                    child has access to quality education.
                  </p>
                  <div className="program-meta">
                    <span className="meta-item">
                      <i className="fas fa-users me-1"></i>500+ beneficiaries
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-map-marker-alt me-1"></i>Nationwide
                    </span>
                  </div>
                  <div className="program-progress mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Goal Progress</span>
                      <span className="fw-bold">75%</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                  <button className="btn btn-primary mt-3 w-100">
                    Register Interest
                  </button>
                </div>
              </div>
            </div>

            <div
              className="col-lg-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="program-card h-100">
                <div className="program-image">
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Digital Learning"
                    className="img-fluid"
                  />
                </div>
                <div className="program-content">
                  <h5 className="program-title">Digital Learning Initiative</h5>
                  <p className="program-description">
                    Establishing computer labs and providing digital literacy
                    training to prepare students for the modern workforce.
                  </p>
                  <div className="program-meta">
                    <span className="meta-item">
                      <i className="fas fa-users me-1"></i>300+ students
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-map-marker-alt me-1"></i>Major cities
                    </span>
                  </div>
                  <div className="program-progress mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Goal Progress</span>
                      <span className="fw-bold">60%</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                  <button className="btn btn-primary mt-3 w-100">
                    Register Interest
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Healthcare Programs */}
          <div className="row mb-5">
            <div className="col-12" data-aos="fade-up">
              <h3 className="fw-bold mb-4">
                <i className="fas fa-heartbeat text-primary me-2"></i>Healthcare
                Programs
              </h3>
            </div>

            <div
              className="col-lg-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="program-card h-100">
                <div className="program-image">
                  <img
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Healthcare Support"
                    className="img-fluid"
                  />
                </div>
                <div className="program-content">
                  <h5 className="program-title">Free Medical Checkups</h5>
                  <p className="program-description">
                    Providing free health checkups and basic medical care for
                    underprivileged communities, including medicine
                    distribution.
                  </p>
                  <div className="program-meta">
                    <span className="meta-item">
                      <i className="fas fa-users me-1"></i>1000+ patients
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-calendar me-1"></i>Monthly events
                    </span>
                  </div>
                  <div className="program-progress mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Goal Progress</span>
                      <span className="fw-bold">85%</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                  <button className="btn btn-primary mt-3 w-100">
                    Register Interest
                  </button>
                </div>
              </div>
            </div>

            <div
              className="col-lg-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="program-card h-100">
                <div className="program-image">
                  <img
                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Elderly Healthcare"
                    className="img-fluid"
                  />
                </div>
                <div className="program-content">
                  <h5 className="program-title">Elderly Healthcare Support</h5>
                  <p className="program-description">
                    Specialized healthcare services and home visits for elderly
                    citizens who lack family support or resources.
                  </p>
                  <div className="program-meta">
                    <span className="meta-item">
                      <i className="fas fa-users me-1"></i>200+ seniors
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-calendar me-1"></i>Weekly visits
                    </span>
                  </div>
                  <div className="program-progress mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Goal Progress</span>
                      <span className="fw-bold">45%</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                  </div>
                  <button className="btn btn-primary mt-3 w-100">
                    Register Interest
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Community Development Programs */}
          <div className="row">
            <div className="col-12" data-aos="fade-up">
              <h3 className="fw-bold mb-4">
                <i className="fas fa-hands-helping text-primary me-2"></i>
                Community Development
              </h3>
            </div>

            <div
              className="col-lg-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="program-card h-100">
                <div className="program-image">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Women Empowerment"
                    className="img-fluid"
                  />
                </div>
                <div className="program-content">
                  <h5 className="program-title">Women Empowerment Program</h5>
                  <p className="program-description">
                    Skills training and microfinance support for women
                    entrepreneurs to start and grow their businesses.
                  </p>
                  <div className="program-meta">
                    <span className="meta-item">
                      <i className="fas fa-users me-1"></i>150+ women
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-calendar me-1"></i>Quarterly
                      workshops
                    </span>
                  </div>
                  <div className="program-progress mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Goal Progress</span>
                      <span className="fw-bold">70%</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                  <button className="btn btn-primary mt-3 w-100">
                    Register Interest
                  </button>
                </div>
              </div>
            </div>

            <div
              className="col-lg-6 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="program-card h-100">
                <div className="program-image">
                  <img
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Child Protection"
                    className="img-fluid"
                  />
                </div>
                <div className="program-content">
                  <h5 className="program-title">Child Protection Initiative</h5>
                  <p className="program-description">
                    Creating safe spaces and providing counseling support for
                    children in difficult circumstances or at-risk situations.
                  </p>
                  <div className="program-meta">
                    <span className="meta-item">
                      <i className="fas fa-users me-1"></i>250+ children
                    </span>
                    <span className="meta-item">
                      <i className="fas fa-map-marker-alt me-1"></i>5 centers
                    </span>
                  </div>
                  <div className="program-progress mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Goal Progress</span>
                      <span className="fw-bold">55%</span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: "55%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-top">
                    <h3 className="fw-bold mb-4">Programs From Database</h3>

                    {loading && <p>Loading programs...</p>}

                    {!loading && programs.length === 0 && (
                      <p>No programs found.</p>
                    )}

                    <div className="row">
                      {programs.map((p) => (
                        <div className="col-lg-6 mb-4" key={p.id}>
                          <div className="program-card h-100">
                            <div className="program-content">
                              <h5 className="program-title">{p.title}</h5>
                              <p className="program-description">
                                {p.description}
                              </p>
                              <p className="text-muted">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                {p.location || "Nationwide"}
                              </p>

                              <button
                                className="btn btn-primary w-100"
                                onClick={() => handleRegister(p.id)}
                              >
                                Register Interest
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h2 className="fw-bold mb-4">Want to Get Involved?</h2>
              <p className="lead text-muted mb-4">
                There are many ways you can support our programs and make a
                difference in the community.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <a href="/donate" className="btn btn-primary btn-lg">
                  <i className="fas fa-heart me-2"></i>Make a Donation
                </a>
                <a href="/register" className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-user-plus me-2"></i>Become a Volunteer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
