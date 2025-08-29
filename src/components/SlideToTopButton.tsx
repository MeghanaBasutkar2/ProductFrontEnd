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
  background: "linear-gradient(90deg, #a259ff 0%, #6f7bfd 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 0,
  width: 64,
  height: 64,
  minWidth: 64,
  minHeight: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  letterSpacing: 0.5,
  boxShadow: "0 2px 16px rgba(120,80,220,0.10)",
  cursor: "pointer",
  userSelect: "none",
  fontSize: "1rem",
  fontWeight: 500,
  padding: 0,
};

const arrowStyle: React.CSSProperties = {
  display: "inline-block",
  width: 10,
  height: 10,
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
          fontFamily: "'Poppins', 'Inter', Arial, sans-serif", // Use Poppins for a clean, modern look
          letterSpacing: 1,
          fontWeight: 600,
        }}
        onClick={handleClick}
        aria-label="Scroll to top"
      >
        <svg style={arrowStyle} viewBox="0 0 28 28" fill="none">
          <path d="M4 10L8 6L12 10" stroke={textColor || "#fff"} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: "1rem" }}>TOP</span>
      </div>
    </div>
  );
};

export default SlideToTopButton;