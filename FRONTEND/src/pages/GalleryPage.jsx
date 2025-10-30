export default function GalleryPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-5 bg-primary text-white" style={{ marginTop: '80px' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center" data-aos="fade-up">
              <h1 className="display-4 fw-bold mb-3">Our Gallery</h1>
              <p className="lead mb-0">
                Witness the impact of your donations through photos and stories from our programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="gallery-filters text-center" data-aos="fade-up">
                <h5 className="mb-3">Filter by Program</h5>
                <div className="filter-buttons">
                  <button className="btn btn-outline-primary active" data-filter="all">All</button>
                  <button className="btn btn-outline-primary" data-filter="education">Education</button>
                  <button className="btn btn-outline-primary" data-filter="healthcare">Healthcare</button>
                  <button className="btn btn-outline-primary" data-filter="women">Women</button>
                  <button className="btn btn-outline-primary" data-filter="children">Children</button>
                  <button className="btn btn-outline-primary" data-filter="elderly">Elderly</button>
                  <button className="btn btn-outline-primary" data-filter="disabled">Disability</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-5">
        <div className="container">
          <div className="row" id="galleryGrid">
            {/* Education Program Images */}
            <div className="col-lg-4 col-md-6 mb-4 gallery-item" data-category="education" data-aos="fade-up" data-aos-delay="100">
              <div className="gallery-card">
                <div className="gallery-image">
                  <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                       alt="Children learning in classroom" className="img-fluid" />
                  <div className="gallery-overlay">
                    <div className="gallery-actions">
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-expand"></i>
                      </button>
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-share"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="gallery-info">
                  <h6 className="gallery-title">Children Education Program</h6>
                  <p className="gallery-description">Students receiving new books and school supplies</p>
                  <div className="gallery-meta">
                    <span className="gallery-date">
                      <i className="fas fa-calendar me-1"></i>March 2024
                    </span>
                    <span className="gallery-location">
                      <i className="fas fa-map-marker-alt me-1"></i>Ho Chi Minh City
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4 gallery-item" data-category="education" data-aos="fade-up" data-aos-delay="200">
              <div className="gallery-card">
                <div className="gallery-image">
                  <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                       alt="Students in computer lab" className="img-fluid" />
                  <div className="gallery-overlay">
                    <div className="gallery-actions">
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-expand"></i>
                      </button>
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-share"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="gallery-info">
                  <h6 className="gallery-title">Digital Learning Initiative</h6>
                  <p className="gallery-description">Students learning computer skills in our new lab</p>
                  <div className="gallery-meta">
                    <span className="gallery-date">
                      <i className="fas fa-calendar me-1"></i>February 2024
                    </span>
                    <span className="gallery-location">
                      <i className="fas fa-map-marker-alt me-1"></i>Hanoi
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Healthcare Images */}
            <div className="col-lg-4 col-md-6 mb-4 gallery-item" data-category="healthcare" data-aos="fade-up" data-aos-delay="300">
              <div className="gallery-card">
                <div className="gallery-image">
                  <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                       alt="Healthcare support" className="img-fluid" />
                  <div className="gallery-overlay">
                    <div className="gallery-actions">
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-expand"></i>
                      </button>
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-share"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="gallery-info">
                  <h6 className="gallery-title">Healthcare Support Program</h6>
                  <p className="gallery-description">Free medical checkup for community members</p>
                  <div className="gallery-meta">
                    <span className="gallery-date">
                      <i className="fas fa-calendar me-1"></i>March 2024
                    </span>
                    <span className="gallery-location">
                      <i className="fas fa-map-marker-alt me-1"></i>Da Nang
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Women Empowerment Images */}
            <div className="col-lg-4 col-md-6 mb-4 gallery-item" data-category="women" data-aos="fade-up" data-aos-delay="400">
              <div className="gallery-card">
                <div className="gallery-image">
                  <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                       alt="Women empowerment" className="img-fluid" />
                  <div className="gallery-overlay">
                    <div className="gallery-actions">
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-expand"></i>
                      </button>
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-share"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="gallery-info">
                  <h6 className="gallery-title">Women Empowerment Workshop</h6>
                  <p className="gallery-description">Skills training workshop for women entrepreneurs</p>
                  <div className="gallery-meta">
                    <span className="gallery-date">
                      <i className="fas fa-calendar me-1"></i>February 2024
                    </span>
                    <span className="gallery-location">
                      <i className="fas fa-map-marker-alt me-1"></i>Can Tho
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add more gallery items as needed */}
            <div className="col-lg-4 col-md-6 mb-4 gallery-item" data-category="children" data-aos="fade-up" data-aos-delay="500">
              <div className="gallery-card">
                <div className="gallery-image">
                  <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                       alt="Child protection" className="img-fluid" />
                  <div className="gallery-overlay">
                    <div className="gallery-actions">
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-expand"></i>
                      </button>
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-share"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="gallery-info">
                  <h6 className="gallery-title">Child Protection Program</h6>
                  <p className="gallery-description">Providing safe space for children in need</p>
                  <div className="gallery-meta">
                    <span className="gallery-date">
                      <i className="fas fa-calendar me-1"></i>January 2024
                    </span>
                    <span className="gallery-location">
                      <i className="fas fa-map-marker-alt me-1"></i>Hue
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4 gallery-item" data-category="elderly" data-aos="fade-up" data-aos-delay="600">
              <div className="gallery-card">
                <div className="gallery-image">
                  <img src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                       alt="Elderly care" className="img-fluid" />
                  <div className="gallery-overlay">
                    <div className="gallery-actions">
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-expand"></i>
                      </button>
                      <button className="btn btn-light btn-sm">
                        <i className="fas fa-share"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="gallery-info">
                  <h6 className="gallery-title">Elderly Care Program</h6>
                  <p className="gallery-description">Healthcare and support for senior citizens</p>
                  <div className="gallery-meta">
                    <span className="gallery-date">
                      <i className="fas fa-calendar me-1"></i>March 2024
                    </span>
                    <span className="gallery-location">
                      <i className="fas fa-map-marker-alt me-1"></i>Nha Trang
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

