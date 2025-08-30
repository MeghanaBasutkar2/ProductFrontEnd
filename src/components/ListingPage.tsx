// Update cart drawer price and description styles
const cartDescStyle: React.CSSProperties = {
  color: "#7b8aaf", // subtle, muted blue-grey
  fontSize: "0.97rem",
  fontWeight: 400,
  fontFamily: "'Inter', Arial, sans-serif",
  marginBottom: 2,
  lineHeight: 1.3,
};
// Match PDP price font: Inter, bold, blue, increased spacing, slightly smaller
const priceStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "#4f8cff",
  fontSize: "1.08rem",
  margin: "8px 0 0 0",
  fontFamily: "'Inter', Arial, sans-serif",
  letterSpacing: "0.04em",
  textAlign: "left",
  transition: "color 0.2s",
  userSelect: "none",
};
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useCart, theme } from "../components/common-dependencies/CartContext";
import SlideToTopButton from "./ui/SlideToTopButton";
import bgImg from '../assets/bg_img_day.png';

const cardContainerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "32px",
  justifyContent: "center",
  alignItems: "start",
  width: "100%",
  maxWidth: 1100,
  margin: "0 auto",
  boxSizing: "border-box",
  marginBottom: 32,
  padding: 0,
};

// Responsive grid for phone view
const getResponsiveCardContainerStyle = () => {
  if (window.innerWidth <= 600) {
    return {
      ...cardContainerStyle,
      gridTemplateColumns: "1fr",
      gap: "20px",
      padding: "0 8px",
      maxWidth: 400,
    };
  }
  return cardContainerStyle;
};

const cardStyleBase: React.CSSProperties = {
  borderRadius: "24px",
  boxShadow: "0 4px 24px rgba(120,144,156,0.08)",
  padding: "16px 16px",
  width: "300px",
  minHeight: "300px",
  maxHeight: "300px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  transition: "transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s",
  cursor: "pointer",
  background: "#fff",
  overflow: "hidden",
  border: "1px solid #e3e8ee",
  justifyContent: "flex-start",
};

const imgWrapperStyle: React.CSSProperties = {
  width: "100%",
  height: "140px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "16px",
  marginBottom: "16px",
  overflow: "hidden",
};

const imgStyle: React.CSSProperties = {
  maxWidth: "100%",
  maxHeight: "100%",
  width: "auto",
  height: "auto",
  objectFit: "contain",
  borderRadius: "12px",
  background: "#f6f6f6",
  border: "none",
  display: "block",
  margin: "0 auto",
};

const buttonStyle: React.CSSProperties = {
  background: "#fff",
  color: "#5b4c9a",
  border: "1.5px solid #bfc6e0",
  borderRadius: "12px",
  padding: "2px 0",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "1rem",
  fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
  alignSelf: "center",
  boxShadow: "none",
  transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
  height: 40,
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const buyNowButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "linear-gradient(90deg, #4f8cff 0%, #6f7bfd 100%)",
  color: "#fff",
  border: "none",
  fontWeight: 700,
  boxShadow: "none",
};

const descStyle: React.CSSProperties = {
  color: "#555",
  fontSize: "1rem", // Match example image
  marginBottom: 6,
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "100%",
  fontWeight: 400, // Normal weight as in example
};

// Utility function to truncate text
function truncate(str: string, n: number) {
  return str && str.length > n ? str.slice(0, n) + "..." : str;
}

const pillButtonStyle: React.CSSProperties = {
  borderRadius: 999,
  border: "1.5px solid #e3dff5",
  background: "#f8f6fc",
  color: "#6d5cae",
  fontWeight: 600,
  fontSize: "1.08rem",
  padding: "0 20px",
  marginRight: 0,
  cursor: "pointer",
  outline: "none",
  minWidth: 0,
  boxShadow: "0 2px 8px rgba(109,92,174,0.04)",
  display: "flex",
  alignItems: "center",
  height: 36,
  transition: "background 0.18s, color 0.18s, border 0.18s",
};


const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  top: "110%",
  left: 0,
  minWidth: 180,
  background: "#fff",
  border: "1px solid #e0e0e0",
  borderRadius: 16,
  boxShadow: "0 4px 16px rgba(120,144,156,0.10)",
  zIndex: 100,
  padding: "8px 0",
};

const dropdownItemStyle: React.CSSProperties = {
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: "1rem",
  color: "#222",
  background: "none",
  border: "none",
  textAlign: "left",
  width: "100%",
};

const selectedDropdownItemStyle: React.CSSProperties = {
  ...dropdownItemStyle,
  fontWeight: 700,
  background: "#f6f6f6",
};

const searchBarWrapperStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 600,
  minWidth: 260,
  flex: 1,
  display: "flex",
  alignItems: "center",
  marginBottom: "24px",
  gap: 12,
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0 28px",
  height: 36,
  borderRadius: 999,
  border: "1.5px solid #e3dff5",
  fontSize: "1.08rem",
  fontFamily: "'Inter', 'Poppins', Arial, sans-serif",
  color: "#6d5cae",
  background: "#f8f6fc",
  boxSizing: "border-box",
  outline: "none",
  transition: "border 0.2s, box-shadow 0.2s",
  display: "flex",
  alignItems: "center",
  fontWeight: 500,
  boxShadow: "0 2px 8px rgba(109,92,174,0.04)",
};

// Match PDP price font for cart: Inter, bold, blue, increased spacing, slightly smaller
const cartPriceStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "#4f8cff",
  fontSize: "0.98rem",
  fontFamily: "'Inter', Arial, sans-serif",
  letterSpacing: "0.04em",
  textAlign: "left",
  transition: "color 0.2s",
  userSelect: "none",
};

const ListingPage: React.FC = () => {
  const {
    cart,
    handleAdd,
    handleCartQtyChange,
    handleRemoveFromCart,
    getDisplayPrice,
    getCartTotal,
  } = useCart();

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");

  const location = useLocation();
  const history = useHistory();

  // Responsive state for grid
  const [responsiveStyle, setResponsiveStyle] = useState(getResponsiveCardContainerStyle());

  useEffect(() => {
    function handleResize() {
      setResponsiveStyle(getResponsiveCardContainerStyle());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Refetch products by category ---
  const fetchProducts = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get("categoryId");
    const productTypeId = params.get("productTypeId");
    if (categoryId && productTypeId) {
      fetch(`http://localhost:9090/lighting/api/products/by-category/${encodeURIComponent(categoryId)}/by-type/${encodeURIComponent(productTypeId)}`, {
        headers: { Accept: "application/json" },
      })
        .then((res) => res.json())
        .then((data) => setListings(data))
        .catch(() => setListings([]));
      return;
    }
    const category = params.get("category");
    if (category) {
      fetch(`http://localhost:9090/lighting/api/products/by-category/${encodeURIComponent(category)}`, {
        headers: { Accept: "application/json" },
      })
        .then((res) => res.json())
        .then((data) => setListings(data))
        .catch(() => setListings([]));
    } else {
      setListings([]);
    }
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Refetch products on back navigation or tab focus ---
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchProducts();
      }
    };
    const handlePopState = () => {
      fetchProducts();
    };
    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [fetchProducts]);

  // Search logic
  const filteredListings = listings.filter((item) =>
    [item.name, item.description1, item.productTypeHeading, item.orderCode, (!isNaN(Number(item.discountedPrice)) && Number(item.discountedPrice) > 0)
    ? item.discountedPrice
    : item.price]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Sorting logic
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high">("featured");
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === "price-low") {
      return getDisplayPrice(a) - getDisplayPrice(b);
    }
    if (sortBy === "price-high") {
      return getDisplayPrice(b) - getDisplayPrice(a);
    }
    return 0; // featured
  });

  function handleCheckout() {
    history.push("/customer-details", { cart });
  }

  return (
    <div
      id="listing-scroll-container"
      style={{
        minHeight: "100vh",
        width: "100vw",
        fontFamily: "'Poppins', 'Inter', 'Roboto', Arial, sans-serif",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        border: "none",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 32,
        background: "#f5f7fa",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "f lex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        {/* Title removed as requested */}
        <div style={searchBarWrapperStyle}>
          <input
            style={{
              ...searchInputStyle,
              fontFamily: "'Poppins', 'Inter', 'Roboto', Arial, sans-serif",
              color: "#37184bff",
              fontWeight: 500,
            }}
              type="text"
              placeholder="Search based on product name, type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ position: "relative" }} ref={sortDropdownRef}>
              <button
                style={{
                  ...pillButtonStyle,
                  minWidth: 0,
                  width: "auto",
                  justifyContent: "center",
                  color: "#6d5cae",
                  paddingLeft: "0.7em",
                  paddingRight: "0.7em",
                  whiteSpace: "nowrap",
                }}
                onClick={() => setSortDropdownOpen((open) => !open)}
                type="button"
              >
                Price Sort
                <span style={{ marginLeft: 8, fontSize: 18, color: "#6d5cae" }}>▼</span>
              </button>
            {sortDropdownOpen && (
              <div style={dropdownStyle}>
                <button
                  style={sortBy === "price-low" ? selectedDropdownItemStyle : dropdownItemStyle}
                  onClick={() => {
                    setSortBy("price-low");
                    setSortDropdownOpen(false);
                  }}
                  type="button"
                >
                  Price-low to high
                </button>
                <button
                  style={sortBy === "price-high" ? selectedDropdownItemStyle : dropdownItemStyle}
                  onClick={() => {
                    setSortBy("price-high");
                    setSortDropdownOpen(false);
                  }}
                  type="button"
                >
                  Price-high to low
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={responsiveStyle}>
        {sortedListings.map((item) => (
          <div
            key={item.id}
            style={cardStyleBase}
            onClick={() => history.push(`/product-detail/${item.id}`, { product: item, cart })}
          >
            <div style={imgWrapperStyle}>
              <img
                src={
                  item.imageUrl && item.imageUrl !== "default.jpg"
                    ? item.imageUrl
                    : undefined // Don't show placeholder
                }
                alt={item.name}
                style={{
                  ...imgStyle,
                  display: item.imageUrl && item.imageUrl !== "default.jpg" ? "block" : "none", // Hide img tag if no image
                }}
              />
            </div>
            <div
              style={{
                fontWeight: 1000,
                fontSize: "1.1rem",
                color: "#37184bff",
                fontFamily: "'Roboto', 'Arial', sans-serif",
                letterSpacing: "0.01em",
                lineHeight: 1.18,
                height: "3.6em", // exactly 3 lines tall
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                textAlign: "left",
                margin: "0 0 8px 0",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                wordBreak: "break-word",
              }}
              title={item.title || item.name}
            >
              {item.title || item.name}
            </div>
            <div style={{ ...descStyle, marginBottom: 0 }}>
              {truncate(item.description || "", 45)}
            </div>
            <div style={{ ...priceStyle, margin: "4px 0 0 0" }}>
              {(
                typeof item.discountedPrice === "number" &&
                !isNaN(item.discountedPrice) &&
                item.discountedPrice > 0 &&
                item.discountedPrice < item.price
              ) ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "#bdbdbd", marginRight: 8, fontWeight: 400 }}>
                    ₹{item.price}
                  </span>
                  <span style={{ ...priceStyle }}>
                    ₹{item.discountedPrice}
                  </span>
                </>
              ) : (
                <span style={{ ...priceStyle }}>
                  ₹{item.price}
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 6,
                width: "100%",
                marginTop: 18,
                padding: "0 0px",
                boxSizing: "border-box",
              }}
            >
              <button
                style={{
                  borderRadius: 999,
                  border: "none",
                  background: "#f4f0fa",
                  color: "#3d3757",
                  fontWeight: 500,
                  fontSize: "1.08rem",
                  fontFamily: "'Inter', Arial, sans-serif",
                  padding: "7px 0",
                  minWidth: 0,
                  height: 36,
                  boxShadow: "none",
                  outline: "none",
                  cursor: "pointer",
                  flex: 1,
                  marginRight: 6,
                  transition: "background 0.18s, color 0.18s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(item);
                  setCartDrawerOpen(true);
                }}
              >
                Add to cart
              </button>
              <button
                style={{
                  borderRadius: 999,
                  border: "none",
                  background: "#6d5cae",
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "1.08rem",
                  fontFamily: "'Inter', Arial, sans-serif",
                  padding: "7px 0",
                  minWidth: 0,
                  height: 36,
                  boxShadow: "none",
                  outline: "none",
                  cursor: "pointer",
                  flex: 1,
                  marginLeft: 6,
                  transition: "background 0.18s, color 0.18s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={async (e) => {
                  e.stopPropagation();
                  // Check if item already in cart
                  const existing = cart.find((c) => c.productId === item.productId || c.id === item.id);
                  if (existing) {
                    await handleCartQtyChange(existing.id, 1); // increment quantity by 1
                  } else {
                    await handleAdd(item);
                  }
                  history.push("/customer-details", {
                    cart: [{ ...item, qty: (existing ? existing.qty + 1 : 1) }],
                  });
                }}
              >
                Buy now
              </button>
            </div>
            {item.hurryUpPromoText && (
              <div
                style={{
                  marginTop: 8,
                  color: "#219150",
                  background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
                  fontWeight: 500,
                  fontSize: "0.68rem",
                  padding: "3px 8px",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(67,233,123,0.10)",
                  display: "block",
                  minWidth: 0,
                  maxWidth: "100%",
                  whiteSpace: "normal",
                  overflow: "visible",
                  textOverflow: "clip",
                  letterSpacing: "0.01em",
                  wordBreak: "break-word",
                }}
                title={item.hurryUpPromoText}
              >
                {item.hurryUpPromoText}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      {cartDrawerOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(30,40,60,0.18)",
            zIndex: 2000,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setCartDrawerOpen(false)}
        >
          <div
            style={{
              width: window.innerWidth <= 700 ? "100vw" : 400,
              maxWidth: "100vw",
              height: "100vh",
              background: "#fff",
              padding: "32px 0 0 0",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
              boxSizing: "border-box",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: 18,
                right: 24,
                background: "none",
                border: "none",
                fontSize: "1.7rem",
                color: "#aaa",
                cursor: "pointer",
                fontWeight: 700,
              }}
              onClick={() => setCartDrawerOpen(false)}
            >
              &times;
            </button>
            <h2 style={{
              fontWeight: 600,
              fontSize: '1.18rem',
              margin: '0 24px 18px 24px',
              color: '#4f4f6f',
              letterSpacing: 0.5,
              textAlign: 'left',
              width: '100%',
              display: 'block',
              fontFamily: "'Inter', Arial, sans-serif",
              textTransform: 'none',
            }}>Cart</h2>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative" }}>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "0 16px 0 16px",
                  minHeight: 0,
                  paddingBottom: 96,
                }}
              >
                {cart.length === 0 ? (
                  <div style={{ color: "#888", marginTop: 32 }}>Your cart is empty.</div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginBottom: 24,
                        borderBottom: "1px solid #eee",
                        paddingBottom: 16,
                      }}
                    >
                      {item.imageUrl && item.imageUrl !== "default.jpg" ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: 64,
                            height: 64,
                            objectFit: "cover",
                            borderRadius: 8,
                            background: "#f3f6fa",
                            border: "1px solid #eee",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: 8,
                            background: "#f3f6fa",
                            border: "1px solid #eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#bfc6e0",
                            fontSize: 22,
                            fontWeight: 600,
                          }}
                        >
                          {/* Optionally, show initials or nothing */}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 1000,
                            fontSize: "0.98rem",
                            color: "#37184bff",
                            fontFamily: "'Roboto', 'Arial', sans-serif",
                            letterSpacing: "0.01em",
                            marginBottom: 2,
                            // font size reduced for cart, spacing unchanged
                          }}
                          title={item.title || item.name}
                        >
                          {item.title || item.name}
                        </div>
                        <div style={cartDescStyle}>
                          {truncate(item.description || "", 45)}
                        </div>
                        <div style={cartPriceStyle}>
                          {(
                            typeof item.discountedPrice === "number" &&
                            !isNaN(item.discountedPrice) &&
                            item.discountedPrice > 0 &&
                            item.discountedPrice < item.price
                          ) ? (
                            <>
                              <span style={{ textDecoration: "line-through", color: "#bdbdbd", marginRight: 8, fontWeight: 400 }}>
                                ₹{item.price}
                              </span>
                              <span style={{ ...cartPriceStyle }}>
                                ₹{item.discountedPrice}
                              </span>
                            </>
                          ) : (
                            <span style={{ ...cartPriceStyle }}>
                              ₹{item.price}
                            </span>
                          )}
                        </div>
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, marginTop: 4, minHeight: 36 }}>
                          <button onClick={() => handleCartQtyChange(item.id, -1)} style={{ fontSize: 18, padding: "2px 8px" }}>-</button>
                          <span>{item.qty}</span>
                          <button onClick={() => handleCartQtyChange(item.id, 1)} style={{ fontSize: 18, padding: "2px 8px" }}>+</button>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            style={{
                              position: "absolute",
                              right: 0,
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#7b8aaf",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: 400,
                              fontSize: "0.97rem",
                              padding: "4px 12px",
                              borderRadius: 8,
                              transition: "background 0.15s",
                              outline: "none",
                              minWidth: 70,
                              textAlign: "center",
                              fontFamily: "'Inter', Arial, sans-serif"
                            }}
                            aria-label="Remove item"
                            title="Remove"
                          >
                            Remove
                          </button>
                          {/* Add right padding to prevent overlap with Remove btn */}
                          <span style={{ display: "inline-block", width: 80 }}></span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div
                  style={{
                    position: "sticky",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "#fff",
                    zIndex: 10,
                    width: "100%",
                    padding: "24px 0 24px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: "0 -2px 16px rgba(120,144,156,0.07)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      margin: "0 0 12px 0",
                      textAlign: "center",
                      color: "#4f8cff",
                      fontSize: "1.08rem",
                      width: "100%",
                      fontFamily: "'Inter', Arial, sans-serif",
                      letterSpacing: "0.04em",
                      userSelect: "none",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#4f8cff", fontFamily: "'Inter', Arial, sans-serif", letterSpacing: "0.04em" }}>
                      Subtotal:
                    </span>{" "}
                    <span style={{ fontWeight: 700, color: "#4f8cff", fontFamily: "'Inter', Arial, sans-serif", letterSpacing: "0.04em" }}>
                      ₹{getCartTotal()}
                    </span>
                  </div>
                  <button
                    style={{
                      background: "linear-gradient(90deg, #4f8cff 0%, #6f7bfd 100%)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "16px",
                      padding: "16px 0",
                      width: "90%",
                      maxWidth: 340,
                      margin: "0 auto",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      boxShadow: "0 2px 8px rgba(120,144,156,0.10)",
                      letterSpacing: "0.01em",
                      display: "block",
                    }}
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div
        id="listing-scroll-container"
        style={{
          // ...your styles
        }}
      >
        {/* ...rest of your code... */}
        <SlideToTopButton scrollContainerId="listing-scroll-container" />
      </div>
    </div>
  );
};

export default ListingPage;