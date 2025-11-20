import React, { useEffect, useMemo, useState } from "react";
import galleryService from "../services/galleryServices";

export default function GalleryPage() {
  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5230/api";
  const backendBase = useMemo(() => apiBase.replace("/api", ""), [apiBase]);

  const resolveImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("/uploads/") ? `${backendBase}${url}` : url;
  };

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

  const categories = useMemo(() => {
    const map = new Map();
    galleryList.forEach((item) => {
      if (item?.category) {
        const label = item.category.trim();
        const value = label.toLowerCase();
        if (!map.has(value)) {
          map.set(value, label);
        }
      }
    });
    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [galleryList]);

  const filteredGallery = useMemo(() => {
    if (activeFilter === "all") return galleryList;

    return galleryList.filter(
      (item) =>
        (item?.category || "general").trim().toLowerCase() === activeFilter
    );
  }, [galleryList, activeFilter]);

  const lastUpdated = useMemo(() => {
    if (!galleryList.length) return null;

    const last = [...galleryList]
      .map((item) => new Date(item?.createdAt || item?.date || Date.now()))
      .sort((a, b) => b - a)[0];

    return isNaN(last) ? null : last.toLocaleDateString();
  }, [galleryList]);

  const heroImage = useMemo(() => {
    if (!galleryList.length) return null;
    return resolveImageUrl(galleryList[0]?.imageUrl);
  }, [galleryList]);

  const heroBackground = heroImage
    ? `linear-gradient(135deg, rgba(13,31,74,0.85), rgba(37,99,235,0.85)), url(${heroImage})`
    : "linear-gradient(135deg, #111c44, #2563eb)";

  const uniquePrograms = useMemo(() => {
    const programs = new Set(
      galleryList
        .map((item) => item?.programName || item?.category)
        .filter(Boolean)
    );
    return programs.size;
  }, [galleryList]);

  const filters = useMemo(
    () => [{ value: "all", label: "All" }, ...categories],
    [categories]
  );

  return (
    <>
      {/* Hero Section */}
      <section
        className="gallery-hero"
        style={{ backgroundImage: heroBackground }}
      >
        <div className="gallery-hero-overlay" />
        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-8" data-aos="fade-up">
              <span className="gallery-hero-badge">
                Capturing Impact
              </span>
              <h1 className="gallery-hero-title">
                Moments that Inspire Action
              </h1>
              <p className="gallery-hero-text">
                Explore heartfelt stories from the field, captured by our
                volunteers and partners. Every frame celebrates the generosity
                of our community.
              </p>
              <div className="gallery-hero-stats">
                <div className="gallery-hero-stat">
                  <span className="stat-label">Photos</span>
                  <h3>{galleryList.length || "—"}</h3>
                  <p>Documented memories</p>
                </div>
                <div className="gallery-hero-stat">
                  <span className="stat-label">Programs</span>
                  <h3>{uniquePrograms || "—"}</h3>
                  <p>Featured initiatives</p>
                </div>
                <div className="gallery-hero-stat">
                  <span className="stat-label">Updated</span>
                  <h3>{lastUpdated || "—"}</h3>
                  <p>Latest contribution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="gallery-filter-section">
        <div className="container">
          <div className="gallery-filter-header">
            <div>
              <h5>Filter by Program</h5>
              <p className="text-muted mb-0">
                Choose a category to highlight specific initiatives
              </p>
            </div>
          </div>
          <div className="gallery-filters-modern">
            {filters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`gallery-filter-chip ${
                  activeFilter === value ? "active" : ""
                }`}
                onClick={() => setActiveFilter(value)}
              >
                {label}
              </button>
            ))}
            {!categories.length && (
              <span className="gallery-filter-empty text-muted">
                Categories will appear once gallery items are added.
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-section">
        <div className="container">
          {loading ? (
            <div className="gallery-skeleton-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="gallery-skeleton-card" />
              ))}
            </div>
          ) : filteredGallery.length > 0 ? (
            <div className="gallery-grid-modern">
              {filteredGallery.map((item, index) => {
                const imageSrc = resolveImageUrl(item?.imageUrl);

                return (
                  <article
                    key={item?.id || index}
                    className="gallery-card-modern"
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                  >
                    <div className="gallery-image-wrapper">
                      <img
                        src={imageSrc}
                        alt={item?.caption || item?.title || "Gallery"}
                      />
                      <div className="gallery-image-badges">
                        {item?.category && (
                          <span className="gallery-image-badge">
                            {item.category}
                          </span>
                        )}
                        {item?.programName && (
                          <span className="gallery-image-badge badge-alt">
                            {item.programName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="gallery-card-body">
                      <div className="gallery-card-title">
                        <h5>{item?.title || "Untitled moment"}</h5>
                        {item?.location && (
                          <span>
                            <i className="fas fa-map-marker-alt me-1" />
                            {item.location}
                          </span>
                        )}
                      </div>
                      {item?.description && (
                        <p className="gallery-card-description">
                          {item.description}
                        </p>
                      )}
                      <div className="gallery-card-meta">
                        <span>
                          <i className="fas fa-calendar me-1" />
                          {item?.date || "Date unknown"}
                        </span>
                        {item?.caption && (
                          <span>
                            <i className="fas fa-user-edit me-1" />
                            {item.caption}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="gallery-empty-state">
              <div className="empty-icon">
                <i className="far fa-images" />
              </div>
              <h4>No moments captured yet</h4>
              <p className="text-muted">
                Once administrators upload images, they will appear here with
                live updates from each program.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
