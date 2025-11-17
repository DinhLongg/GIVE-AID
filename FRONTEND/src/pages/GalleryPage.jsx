import React, { useEffect, useState } from "react";
import galleryService from "../services/galleryServices";

export default function GalleryPage() {
  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await galleryService.getAll();
        setGalleryList(res);
      } catch (error) {
        console.error("Lỗi khi tải gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

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
              <h1 className="display-4 fw-bold mb-3">Our Gallery</h1>
              <p className="lead mb-0">
                Witness the impact of your donations through photos and stories
                from our programs.
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
              <div
                className="gallery-filters text-center"
                data-aos="fade-up"
              >
                <h5 className="mb-3">Filter by Program</h5>
                <div className="filter-buttons">
                  <button
                    className="btn btn-outline-primary active"
                    data-filter="all"
                  >
                    All
                  </button>
                  <button className="btn btn-outline-primary" data-filter="education">
                    Education
                  </button>
                  <button className="btn btn-outline-primary" data-filter="healthcare">
                    Healthcare
                  </button>
                  <button className="btn btn-outline-primary" data-filter="women">
                    Women
                  </button>
                  <button className="btn btn-outline-primary" data-filter="children">
                    Children
                  </button>
                  <button className="btn btn-outline-primary" data-filter="elderly">
                    Elderly
                  </button>
                  <button className="btn btn-outline-primary" data-filter="disabled">
                    Disability
                  </button>
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
            {loading ? (
              <p className="text-center">Đang tải dữ liệu...</p>
            ) : galleryList.length > 0 ? (
              galleryList.map((item, index) => {
                // If image is local upload (starts with /uploads/), prefix with backend base URL (without /api)
                const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5230/api';
                const backendBase = apiBase.replace('/api', ''); // Remove /api to get backend root
                const imageSrc = item.imageUrl?.startsWith('/uploads/')
                  ? `${backendBase}${item.imageUrl}`
                  : item.imageUrl;
                
                return (
                <div
                  key={item.id || index}
                  className="col-lg-4 col-md-6 mb-4 gallery-item"
                  data-category={item.category || "general"}
                  data-aos="fade-up"
                  data-aos-delay={100 * (index + 1)}
                >
                  <div className="gallery-card">
                    <div className="gallery-image">
                      <img
                        src={imageSrc}
                        alt={item.caption || item.title || 'Gallery image'}
                        className="img-fluid"
                      />
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
                      <h6 className="gallery-title">{item.title}</h6>
                      <p className="gallery-description">
                        {item.description}
                      </p>
                      <div className="gallery-meta">
                        <span className="gallery-date">
                          <i className="fas fa-calendar me-1"></i>
                          {item.date || "N/A"}
                        </span>
                        <span className="gallery-location">
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {item.location || "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })
            ) : (
              <>
                {/* Nếu API chưa có dữ liệu, hiển thị mẫu cũ */}
                <div className="text-center text-muted">
                  <p>Không có hình ảnh nào được hiển thị.</p>
                  <p>Hãy thêm dữ liệu vào bảng Gallery trong backend.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
