import PropTypes from "prop-types";

export default function PageBanner({
  title,
  subtitle,
  eyebrowText,
  align = "center",
  accent = "primary",
  topSpacing = true,
  backgroundImage,
  children,
}) {
  const classes = [
    "page-banner",
    `page-banner--${align}`,
    `page-banner--${accent}`,
    topSpacing ? "page-banner--with-spacing" : "",
    backgroundImage ? "page-banner--has-image" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inlineStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(130deg, rgba(6, 11, 38, 0.85), rgba(37, 99, 235, 0.75)), url(${backgroundImage})`,
      }
    : undefined;

  return (
    <section className={classes} style={inlineStyle}>
      <div className="page-banner__shapes">
        <span />
        <span />
        <span />
      </div>
      <div className="container">
        <div className="page-banner__content">
          {eyebrowText && (
            <span className="page-banner__eyebrow">{eyebrowText}</span>
          )}
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
          {children && <div className="page-banner__extra">{children}</div>}
        </div>
      </div>
    </section>
  );
}

PageBanner.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  eyebrowText: PropTypes.string,
  align: PropTypes.oneOf(["left", "center", "right"]),
  accent: PropTypes.oneOf(["primary", "sunset", "forest", "ocean", "lavender"]),
  topSpacing: PropTypes.bool,
  backgroundImage: PropTypes.string,
  children: PropTypes.node,
};

