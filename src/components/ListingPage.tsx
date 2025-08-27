import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { fetchCart, addToCart, updateCartItem, removeCartItem } from "../components/api/CartApi";

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
  padding: "24px 20px",
  width: "300px",
  minHeight: "340px", // Reduced height
  maxHeight: "340px", // Reduced height
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  marginBottom: "32px",
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
  padding: "10px 0",
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
  color: "#7b8aaf",
  fontSize: "0.98rem",
  marginBottom: 12,
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "100%",
};

function truncate(str: string, n: number) {
  return str && str.length > n ? str.slice(0, n) + "..." : str;
}

// Use discountedPrice if it's a valid number and >0, else use price
function getDisplayPrice(item: any) {
  const discounted = Number(item.discountedPrice);
  if (!isNaN(discounted) && discounted > 0) {
    return discounted;
  }
  return Number(item.price);
}

const ListingPage: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
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

  // --- Fetch cart on mount ---
  useEffect(() => {
    async function loadCart() {
      const data = await fetchCart();
      setCart(
        Array.isArray(data.items)
          ? data.items.map((item: any) => ({
              ...item,
              id: item.lineId,
              name: item.productName,
              qty: item.quantity,
              price: item.unitPrice,
            }))
          : []
      );
    }
    loadCart();
  }, []);

  // --- Add to Cart ---
  async function handleAdd(item: any) {
    const data = await addToCart(item.id, 1);
    setCart(
      Array.isArray(data.items)
        ? data.items.map((item: any) => ({
            ...item,
            id: item.lineId,
            name: item.productName,
            qty: item.quantity,
            price: item.unitPrice,
          }))
        : []
    );
    setCartDrawerOpen(true);
  }

  // --- Change Cart Quantity ---
  async function handleCartQtyChange(lineId: string, delta: number) {
    const cartItem = cart.find((i) => i.id === lineId);
    if (!cartItem) return;
    const newQty = cartItem.qty + delta;
    let data;
    if (newQty <= 0) {
      data = await removeCartItem(cartItem.id);
    } else {
      data = await updateCartItem(cartItem.id, newQty);
    }
    setCart(
      Array.isArray(data.items)
        ? data.items.map((item: any) => ({
            ...item,
            id: item.lineId,
            name: item.productName,
            qty: item.quantity,
            price: item.unitPrice,
          }))
        : []
    );
  }

  // --- Remove from Cart ---
  async function handleRemoveFromCart(lineId: string) {
    const data = await removeCartItem(lineId);
    setCart(
      Array.isArray(data.items)
        ? data.items.map((item: any) => ({
            ...item,
            id: item.lineId,
            name: item.productName,
            qty: item.quantity,
            price: item.unitPrice,
          }))
        : []
    );
  }

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

  function handleCheckout() {
    history.push("/customer-details", { cart });
  }

  const getCartTotal = () => cart.reduce((sum, item) => sum + getDisplayPrice(item) * item.qty, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #f6f6f6 60%, #e9e9ff 100%)",
        fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
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
        paddingTop: 32, // Add this line for spacing
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "2rem",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          Find Your Dream Lights
        </div>
        <div
          style={{
            marginBottom: "24px",
            width: "100%",
            maxWidth: 600, // Increased width for larger search bar
            minWidth: 260,
            flex: 1,
            display: "flex",
          }}
        >
          <input
            style={{
              width: "100%",
              padding: "14px 22px", // More padding for a bigger field
              borderRadius: 12,
              border: "1px solid #e0e0e0",
              fontSize: "1.08rem",
              fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
              background: "#fff",
              boxSizing: "border-box",
              outline: "none",
              transition: "border 0.2s",
            }}
            type="text"
            placeholder="Search based on product name, type, or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div style={responsiveStyle}>
        {filteredListings.map((item) => (
          <div
            key={item.id}
            style={cardStyleBase}
            onClick={() => history.push(`/product-detail/${item.id}`, { product: item, cart })}
          >
            <div style={imgWrapperStyle}>
              <img
                src={item.imageUrl && item.imageUrl !== "default.jpg" ? item.imageUrl : "https://img.icons8.com/ios-filled/200/light.png"}
                alt={item.name}
                style={imgStyle}
              />
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{item.title || item.name}</div>
            <span style={descStyle}>
              {truncate(item.description || "", 45)}
            </span>
            {/* Order number (orderCode) above price */}
            {item.orderCode && (
              <div style={{ color: "#7b8aaf", fontSize: "0.98rem", marginBottom: 4 }}>
                Product Code: {item.orderCode}
              </div>
            )}
            <div style={{ fontWeight: 700, color: "#4f8cff", fontSize: "1.1rem" }}>
              {(!isNaN(Number(item.discountedPrice)) && Number(item.discountedPrice) > 0 && item.discountedPrice !== item.price) ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "#bdbdbd", marginRight: 8, fontWeight: 500 }}>
                    ₹{item.price}
                  </span>
                  <span style={{ color: "#4f8cff" }}>₹{item.discountedPrice} INR</span>
                </>
              ) : (
                <>₹{item.price} INR</>
              )}
            </div>
            <div style={{ flexGrow: 1 }} />
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <button
                style={{ ...buttonStyle, flex: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(item);
                }}
              >
                <span style={{ display: "flex", alignItems: "center", fontSize: 18, marginRight: 6 }}>
                  <svg width="20" height="20" fill="none" stroke="#5b4c9a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </span>
                Add to Cart
              </button>
              <button
                style={{ ...buyNowButtonStyle, flex: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  history.push("/customer-details", {
                    cart: [{ ...item, qty: 1 }],
                  });
                }}
              >
                Buy Now
              </button>
            </div>
            {item.hurryUpPromoText && (
              <div
                style={{
                  marginTop: 8,
                  color: "#219150",
                  background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
                  fontWeight: 500,
                  fontSize: "0.68rem", // Much smaller font
                  padding: "3px 8px",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(67,233,123,0.10)",
                  display: "block",
                  minWidth: 0,
                  maxWidth: "100%",
                  whiteSpace: "normal", // Allow full text to wrap
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
            <h2 style={{ fontWeight: 700, fontSize: "1.4rem", margin: "0 24px 24px 24px" }}>Cart</h2>
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
                      <img
                        src={
                          item.imageUrl && item.imageUrl !== "default.jpg"
                            ? item.imageUrl
                            : "https://img.icons8.com/ios-filled/200/light.png"
                        }
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
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: 4 }}>{item.title || item.name}</div>
                        <div style={{ fontWeight: 700, color: "#4f8cff", fontSize: "1.1rem" }}>
                          {(!isNaN(Number(item.discountedPrice)) && Number(item.discountedPrice) > 0 && item.discountedPrice !== item.price) ? (
                            <>
                              <span style={{ textDecoration: "line-through", color: "#bdbdbd", marginRight: 8, fontWeight: 500 }}>
                                ₹{item.price}
                              </span>
                              <span style={{ color: "#4f8cff" }}>₹{item.discountedPrice} INR</span>
                            </>
                          ) : (
                            <>₹{item.price} INR</>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                          <button onClick={() => handleCartQtyChange(item.id, -1)} style={{ fontSize: 18, padding: "2px 8px" }}>-</button>
                          <span>{item.qty}</span>
                          <button onClick={() => handleCartQtyChange(item.id, 1)} style={{ fontSize: 18, padding: "2px 8px" }}>+</button>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            style={{
                              marginLeft: 12,
                              color: "#7b8aaf", // Updated to theme color
                              background: "none",
                              border: "none",
                              cursor: "pointer"
                            }}
                          >
                            Remove
                          </button>
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
                      fontWeight: 600,
                      margin: "0 0 12px 0",
                      textAlign: "center",
                      color: "#4f8cff",
                      fontSize: "1.08rem",
                      width: "100%",
                    }}
                  >
                    Subtotal:{" "}
                    <span style={{ color: "#4f8cff", fontWeight: 700 }}>₹{getCartTotal()} INR</span>
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
    </div>
  );
};

export default ListingPage;