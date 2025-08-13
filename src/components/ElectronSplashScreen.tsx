import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const pageStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  minHeight: "100vh",
  width: "100vw",
  fontFamily: "'Poppins', 'Inter', 'Roboto', Arial, sans-serif",
  padding: 0,
  margin: 0,
  boxSizing: "border-box",
  border: "none",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
};

const lampContainerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 400,
  margin: "48px auto 0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const lampSVGStyle: React.CSSProperties = {
  width: "180px",
  height: "180px",
  marginBottom: "-32px",
};

const cardContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "24px", // Reduced gap between cards
  padding: "32px 12px 32px 12px", // Reduced padding
  width: "100%",
  flexWrap: "wrap",
  maxWidth: "1000px", // Slightly reduced max width
  margin: "0 auto",
  boxSizing: "border-box",
  overflowX: "hidden",
  minHeight: "0",
  maxHeight: "none", // Remove maxHeight to avoid clipping
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.97)",
  borderRadius: "28px", // Slightly smaller radius
  boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
  padding: "28px 18px", // Reduced padding inside card
  width: "240px", // Reduced card width
  textAlign: "center",
  cursor: "pointer",
  transition: "transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s",
  color: "#222",
  border: "2px solid #fff",
  position: "relative",
  overflow: "hidden",
  marginBottom: "24px", // Reduced bottom margin
};

const cardHoverStyle: React.CSSProperties = {
  transform: "scale(1.05) translateY(-8px)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.14)",
  border: "2px solid #fda085",
};

const iconStyle: React.CSSProperties = {
  fontSize: "2.1rem", // Reduced icon size
  marginBottom: "12px",
  color: "#fda085",
  filter: "drop-shadow(0 2px 8px #f6d36555)",
};

const contentWrapperStyle: React.CSSProperties = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "0 12px",
  boxSizing: "border-box",
  width: "100%",
};

const headerStyle: React.CSSProperties = {
  margin: "0 0 12px 0",
  fontWeight: 900,
  fontSize: "2.8rem",
  color: "#222",
  textAlign: "left",
  letterSpacing: "0.04em",
  fontFamily: "'Poppins', 'Playfair Display', serif",
  textShadow: "0 4px 24px rgba(0,0,0,0.18)",
  paddingLeft: 0, // Remove calc, align to wrapper
  boxSizing: "border-box",
};

const subHeaderStyle: React.CSSProperties = {
  textAlign: "left",
  marginBottom: "24px",
  color: "#7b8aaf",
  fontSize: "1.3rem",
  fontWeight: 500,
  letterSpacing: "0.02em",
  textShadow: "0 2px 12px rgba(0,0,0,0.10)",
  paddingLeft: 0, // Remove calc, align to wrapper
  boxSizing: "border-box",
};

const ElectronSplashScreen: React.FC = () => {
  const categories = [
    { id: "1.0", name: "Category 1.0", icon: "💡" },
    { id: "2.0", name: "Category 2.0", icon: "✨" },
    { id: "11.0", name: "Category 11.0", icon: "🔆" },
  ];
  const [listings, setListings] = useState<any[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;
    fetch("http://localhost:9090/lighting/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          const filteredData = data.filter((item: any) =>
            categories.some((category) => category.id === item.categoryId)
          );
          setListings(filteredData);
        }
      })
      .catch(() => {
        if (isMounted) setListings([]);
      });
    return () => {
      isMounted = false;
    };
  }, [categories]);

  const handleCategoryClick = (categoryId: string) => {
    const filteredListings = listings.filter(item => item.categoryId === categoryId);
    history.push(`/listings?category=${categoryId}&data=${encodeURIComponent(JSON.stringify(filteredListings))}`);
  };

  return (
    <div style={pageStyle}>
      <div style={lampContainerStyle}>
        {/* SVG Lamp Illustration */}
        <svg style={lampSVGStyle} viewBox="0 0 180 180" fill="none">
          <rect x="87" y="10" width="6" height="60" rx="3" fill="#222" />
          <ellipse cx="90" cy="80" rx="60" ry="12" fill="#ffe7b2" opacity="0.3" />
          <polygon points="40,70 140,70 90,130" fill="#f6d365" />
          <ellipse cx="90" cy="130" rx="22" ry="8" fill="#fffbe7" />
          <circle cx="90" cy="120" r="13" fill="#fffde7" />
          <circle cx="90" cy="120" r="7" fill="#fffbe7" />
        </svg>
      </div>
      <div style={contentWrapperStyle}>
        <div style={headerStyle}>Electron Innovations</div>
        <div style={subHeaderStyle}>Ignite Your Imagination With Light</div>
        {/* If you have a search bar, place it here and style it with width: "100%" */}
        <div style={cardContainerStyle}>
          {categories.map((category) => (
            <div
              key={category.id}
              style={{
                ...cardStyle,
                ...(hovered === category.id ? cardHoverStyle : {}),
              }}
              onClick={() => handleCategoryClick(category.id)}
              onMouseEnter={() => setHovered(category.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={iconStyle}>{category.icon}</div>
              <h2 style={{ fontFamily: "'Poppins', serif", fontWeight: 700, fontSize: "1.6rem", margin: "0 0 12px 0" }}>
                {category.name}
              </h2>
              <p style={{ color: "#888", fontSize: "1.08rem", margin: 0 }}>
                Explore lights in <span style={{ color: "#fda085", fontWeight: 600 }}>{category.name}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElectronSplashScreen;