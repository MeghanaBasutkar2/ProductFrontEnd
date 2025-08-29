import React, { useEffect, useState } from "react";

const containerStyle: React.CSSProperties = {
  position: "fixed",
  right: 0,
  bottom: 0,
  zIndex: 3000,
  margin: 0,
  padding: 0,
};

const boxStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #0f1315ff 0%, #090a0aff 100%)",
  color: "#fff",
  width: 60,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  letterSpacing: 0.5,
  boxShadow: "0 2px 16px rgba(73, 68, 135, 0.1)",
  cursor: "pointer",
  userSelect: "none",
  fontSize: "1rem",
  fontWeight: 400,
  padding: "0 12px",
  transition: "box-shadow 0.22s, border 0.22s, transform 0.22s cubic-bezier(.4,2,.6,1), filter 0.4s cubic-bezier(.4,2,.6,1)",
};

const arrowStyle: React.CSSProperties = {
  display: "inline-block",
  width: 40,
  height: 40,
  marginRight: 0,
  marginLeft: -2,
};

interface SlideToTopButtonProps {
  scrollContainerId?: string;
  textColor?: string;
}

const SlideToTopButton: React.FC<SlideToTopButtonProps> = ({ scrollContainerId, textColor }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let scrollContainer: HTMLElement | Window = window;
    if (scrollContainerId) {
      const el = document.getElementById(scrollContainerId);
      if (el) scrollContainer = el;
    }

    const onScroll = () => {
      let scrollTop = 0;
      if (scrollContainer instanceof HTMLElement) {
        scrollTop = scrollContainer.scrollTop;
      } else {
        scrollTop = window.scrollY;
      }
      setVisible(scrollTop > 80);
    };

    if (scrollContainer instanceof HTMLElement) {
      scrollContainer.addEventListener("scroll", onScroll, { passive: true });
      return () => scrollContainer.removeEventListener("scroll", onScroll);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [scrollContainerId]);

  const handleClick = () => {
    let scrollContainer: HTMLElement | Window = window;
    if (scrollContainerId) {
      const el = document.getElementById(scrollContainerId);
      if (el) scrollContainer = el;
    }
    if (scrollContainer instanceof HTMLElement) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <div style={containerStyle}>
      <div
        style={{
          ...boxStyle,
          color: textColor || "#fff",
          fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
          letterSpacing: 1.5,
          fontWeight: 500,
        }}
        onClick={handleClick}
        aria-label="Scroll to top"
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.045) translateY(-6px)';
          e.currentTarget.style.filter = 'brightness(1.04)';
          e.currentTarget.style.boxShadow = '0 0 24px 4px #00eaff88, 0 6px 24px rgba(0,0,0,0.10)';
          e.currentTarget.style.border = '2.5px solid #00eaff';
          e.currentTarget.style.transition = 'box-shadow 0.25s cubic-bezier(.4,2,.6,1), border 0.22s, transform 0.22s cubic-bezier(.4,2,.6,1), filter 0.4s cubic-bezier(.4,2,.6,1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.filter = '';
          e.currentTarget.style.boxShadow = '0 2px 16px rgba(73, 68, 135, 0.1)';
          e.currentTarget.style.border = 'none';
          e.currentTarget.style.transition = 'box-shadow 0.22s, border 0.22s, transform 0.22s cubic-bezier(.4,2,.6,1), filter 0.4s cubic-bezier(.4,2,.6,1)';
        }}
      >
        <svg style={{ ...arrowStyle, width: 22, height: 22, marginRight: 8, marginLeft: 0 }} viewBox="0 0 22 22" fill="none">
          <polyline
            points="5 13 11 7 17 13"
            stroke={textColor || "#fff"}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span
          style={{
            fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            color: "#a77fd9",
            lineHeight: 1.13,
            padding: 0,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            opacity: 0.85,
            transition: 'color 0.2s',
            userSelect: 'none',
          }}
        >
          TOP
        </span>
      </div>
    </div>
  );
};

export default SlideToTopButton;