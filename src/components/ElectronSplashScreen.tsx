import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import bgImg from '../assets/bg_img_night.png';
import Lottie from "lottie-react";
import splashLottie from "../components/lottie/splash-lottie.json";
import SlideToTopButton from './ui/SlideToTopButton';

// Add Orbitron font import for modern/futuristic look (top-level, after imports)
if (typeof document !== 'undefined' && !document.getElementById('orbitron-font')) {
  const link = document.createElement('link');
  link.id = 'orbitron-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800&display=swap';
  document.head.appendChild(link);
}

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
  overflowY: "auto", // Enable vertical scrolling everywhere
};

// Responsive styles for background image
const bgImageStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "auto",
  minHeight: "100vh",
  zIndex: 0,
  objectFit: "cover",
  pointerEvents: "none",
  userSelect: "none",
  margin: 0,
  padding: 0,
  transition: "all 0.2s",
};

// Responsive card container
const cardContainerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "24px",
  padding: "32px 12px 32px 12px",
  width: "100%",
  flexWrap: "wrap",
  maxWidth: "1000px",
  margin: "0 auto",
  boxSizing: "border-box",
  overflowX: "hidden",
  minHeight: "0",
  maxHeight: "none",
};

// Responsive card style
const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.97)",
  borderRadius: "24px",
  boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
  padding: "20px 12px",
  width: "180px",
  textAlign: "center",
  cursor: "pointer",
  transition: "transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s",
  color: "#222",
  border: "2px solid #fff",
  position: "relative",
  overflow: "hidden",
  marginBottom: "20px",
  minHeight: 160,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  willChange: "box-shadow, filter, transform",
};

// Add responsive styles via a style tag
if (typeof document !== 'undefined' && !document.getElementById('splash-responsive-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'splash-responsive-styles';
  styleSheet.innerHTML = `
    @media (max-width: 700px) {
      #splash-scroll-container .card-container {
        gap: 12px !important;
        padding: 18px 2vw 18px 2vw !important;
        max-width: 98vw !important;
      }
      #splash-scroll-container .card {
        width: 92vw !important;
        min-width: 0 !important;
        max-width: 98vw !important;
        margin-bottom: 16px !important;
        min-height: 120px !important;
        padding: 14px 6px !important;
      }
      #splash-bg-img {
        width: 100vw !important;
        min-height: 100vh !important;
        object-fit: cover !important;
        left: 0 !important;
        top: 0 !important;
      }
    }
    @media (max-width: 480px) {
      #splash-scroll-container .card {
        width: 98vw !important;
        max-width: 99vw !important;
        min-height: 220px !important;
        font-size: 0.98rem !important;
        padding: 10px 2px !important;
      }
      #splash-bg-img {
        width: 100vw !important;
        min-height: 100vh !important;
        object-fit: cover !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}

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



const cardHoverStyle: React.CSSProperties = {
  transform: "scale(1.05) translateY(-8px)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.14)",
  border: "2px solid #fda085",
};

const iconStyle: React.CSSProperties = {
  fontSize: "2.1rem",
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
  position: "relative", // for stacking bg image
  overflow: "hidden",
};

const headerStyle: React.CSSProperties = {
  margin: "0 0 8px 0",
  fontWeight: 700,
  fontSize: "1.08rem",
  color: "#a78bfa",
  textAlign: "center",
  letterSpacing: "0.14em",
  fontFamily: "'Orbitron', 'Montserrat', 'Poppins', 'Inter', Arial, sans-serif",
  textShadow: "0 0 5px #a78bfa, 0 0 1px #fff",
  paddingTop: 16,
  boxSizing: "border-box",
  fontStyle: "normal",
  textTransform: "uppercase",
  lineHeight: 1.13,
  background: 'linear-gradient(90deg, #a78bfa 60%, #00eaff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const subHeaderStyle: React.CSSProperties = {
  textAlign: "center", // Center align
  marginBottom: "24px",
  color: "#7b8aaf",
  fontSize: "1.3rem",
  fontWeight: 500,
  letterSpacing: "0.02em",
  textShadow: "0 2px 12px rgba(0,0,0,0.10)",
  paddingLeft: 0,
  boxSizing: "border-box",
};

const ElectronSplashScreen: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('glow-sweep-keyframes')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'glow-sweep-keyframes';
      styleSheet.innerHTML = `
        @keyframes glowSweep {
          0% {
            background-position: 0% 0%;
            opacity: 0.7;
          }
          40% {
            background-position: 100% 0%;
            opacity: 1;
          }
          60% {
            background-position: 100% 100%;
            opacity: 0.95;
          }
          100% {
            background-position: 0% 0%;
            opacity: 0.7;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:9090/lighting/api/categories", {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const history = useHistory();

  const handleProductTypeClick = (
    categoryId: string,
    categoryDisplayName: string,
    productTypeId: string,
    productTypeHeading: string
  ) => {
    history.push(
      `/listings?categoryId=${encodeURIComponent(categoryId)}&productTypeId=${encodeURIComponent(productTypeId)}`
    );
  };

  // Card hover handlers to avoid inline type assertions in JSX
  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'scale(1.045) translateY(-6px)';
    e.currentTarget.style.filter = 'brightness(1.04)';
    e.currentTarget.style.boxShadow = '0 0 24px 4px #00eaff88, 0 6px 24px rgba(0,0,0,0.10)';
    e.currentTarget.style.border = '2.5px solid #00eaff';
    e.currentTarget.style.transition = 'box-shadow 0.25s cubic-bezier(.4,2,.6,1), border 0.22s, transform 0.22s cubic-bezier(.4,2,.6,1), filter 0.4s cubic-bezier(.4,2,.6,1)';
  };
  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.filter = '';
    e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.10)';
    e.currentTarget.style.border = '2px solid #fff';
    e.currentTarget.style.transition = 'box-shadow 0.22s, border 0.22s, transform 0.22s cubic-bezier(.4,2,.6,1), filter 0.4s cubic-bezier(.4,2,.6,1)';
  };

  return (
    <div id="splash-scroll-container" style={pageStyle}>
      {/* Background image, not skewed, covers width, natural height, top-left of page */}
      <img
        id="splash-bg-img"
        src={bgImg}
        alt="Background Decorative"
        style={bgImageStyle}
      />
      <div style={{ height: 12 }} />
      <div style={contentWrapperStyle}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
            <span style={headerStyle}>\Electron\/Innovations/</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 10,
              marginTop: 8,
              width: '100%'
            }}>
              <span style={{
                fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
                fontWeight: 500,
                fontSize: '1.18rem',
                color: '#d6bcf6ff',
                letterSpacing: '0.01em',
                lineHeight: 1.13,
                display: 'flex',
                alignItems: 'center',
                marginBottom: 0,
                paddingTop: 0,
              }}>
                Ignite Your Imagination
                <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8, marginTop: 2 }}>
                  <Lottie
                    animationData={splashLottie}
                    loop
                    autoplay
                    style={{ width: 34, height: 36, verticalAlign: 'middle', filter: 'blur(0.2px) drop-shadow(0 0 6px #a78bfa55)', opacity: 0.92 }}
                  />
                </span>
              </span>
            </div>
          </div>
          <div style={{ marginTop: 40 }} />
          {loading ? (
            <div style={{ textAlign: "center", margin: "0px 0" }}>Loading...</div>
          ) : (
            <div>
              {categories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.93rem",
                      margin: "14px 0 8px 0",
                      textAlign: "left",
                      color: "#00eaff",
                      textShadow: "0 0 3px #00eaff, 0 0 1px #fff",
                      fontFamily: "'Orbitron', 'Montserrat', 'Poppins', 'Inter', Arial, sans-serif",
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                    }}
                  >
                    {cat.categoryDisplayName}
                  </div>

                  <div className="card-container" style={cardContainerStyle}>
                    {cat.items.map((type: any) => (
                      <div
                        key={type.productTypeId}
                        className="card"
                        style={{
                          ...cardStyle,
                          background: type.imageUrl
                            ? `url(${type.imageUrl}) center center/cover no-repeat`
                            : cardStyle.background,
                          position: "relative",
                          color: "#222",
                          cursor: "pointer",
                          border: "2px solid #fff",
                          boxShadow: "0 6px 24px rgba(0,0,0,0.10)",
                          transition: "transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s, filter 0.4s cubic-bezier(.4,2,.6,1)",
                          overflow: "hidden",
                          marginBottom: "24px",
                          minHeight: 220,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                        }}
                        onMouseEnter={handleCardMouseEnter}
                        onMouseLeave={handleCardMouseLeave}
                        onClick={() =>
                          handleProductTypeClick(
                            cat.id,
                            cat.categoryDisplayName,
                            type.productTypeId,
                            type.productTypeHeading
                          )
                        }
                      >
                        {/* Overlay for readability */}
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: type.imageUrl
                              ? "linear-gradient(0deg, rgba(255,255,255,0.92) 40%, rgba(255,255,255,0.12) 100%)"
                              : "none",
                            zIndex: 1,
                          }}
                        />
                        <div style={{ position: "relative", zIndex: 2 }}>
                          <div
                            style={{
                              fontFamily: "'Roboto', 'Arial', sans-serif",
                              fontWeight: 1000,
                              fontSize: "1.1rem",
                              marginBottom: 8,
                              minHeight: 60,
                              maxHeight: 66,
                              maxWidth: 180,
                              width: 180,
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              textOverflow: "ellipsis",
                              textAlign: "center",
                              marginLeft: "auto",
                              marginRight: "auto",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#37184bff",
                              letterSpacing: "0.01em",
                              lineHeight: 1.18,
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                            title={type.productTypeHeading}
                          >
                            {type.productTypeHeading}
                          </div>
                          <div
                            style={{
                              marginTop: 12,
                              color: "#a77fd9",
                              background: "none",
                              border: "none",
                              borderRadius: 12,
                              padding: 0,
                              width: "100%",
                              fontWeight: 500,
                              fontSize: "1rem",
                              cursor: "pointer",
                              fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
                              opacity: 0.85,
                              letterSpacing: "0.01em",
                              transition: "color 0.2s",
                              userSelect: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 8,
                            }}
                          >
                            <span>Explore</span>
                            <span style={{ fontSize: "1.15em", display: "flex", alignItems: "center" }}>→</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <SlideToTopButton scrollContainerId="splash-scroll-container" />
      {/* Removed top-right Lottie */}
    </div>
  );
};

export default ElectronSplashScreen;