import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

// Soft, modern Google Pay-inspired palette
const cardColors = [
  "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", // soft blue-gray
  "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)", // light blue
  "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)", // off-white
];

const pageStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  minHeight: "100vh",
  width: "100%",
  fontFamily: "'Poppins', 'Inter', 'Roboto', Arial, sans-serif",
  padding: 0, // removed horizontal padding
  margin: 0,
  boxSizing: "border-box",
  border: "none",
  overflowY: "auto",
  overflowX: "hidden",
};

const contentWrapperStyle: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  width: "100%",
  boxSizing: "border-box",
  padding: "0 24px", // Slightly more padding for a modern look
};

const headerStyle: React.CSSProperties = {
  margin: "32px 0 12px 0",
  fontWeight: 800,
  fontSize: "2.3rem",
  color: "#222",
  textAlign: "left",
  letterSpacing: "0.01em",
  fontFamily: "'Poppins', sans-serif",
};

const welcomeStyle: React.CSSProperties = {
  fontSize: "1.1rem",
  color: "#7b8aaf",
  paddingLeft: "32px",
  marginBottom: "10px",
  fontFamily: "'Inter', sans-serif",
};

const searchStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  margin: "0 0 24px 0",
  width: "100%",
  justifyContent: "flex-start",
};

const inputStyle: React.CSSProperties = {
  padding: "14px 22px",
  borderRadius: "18px",
  border: "1px solid #e0e0e0",
  fontSize: "1.05rem",
  width: "50%", // Reduced width to half
  background: "#f3f6fa",
  fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
};

const cardContainerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)", // 3 items per row
  gap: "32px",
  padding: 0,
  margin: 0,
  width: "100%",
  boxSizing: "border-box",
  justifyItems: "stretch",
  alignItems: "stretch",
};

const cardStyleBase: React.CSSProperties = {
  borderRadius: "24px",
  boxShadow: "0 4px 24px rgba(120,144,156,0.08)",
  padding: "24px 20px",
  width: "300px",
  minHeight: "420px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  marginBottom: "32px",
  transition: "transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s",
  cursor: "pointer",
  background: "#fff",
  overflow: "hidden",
  border: "1px solid #e3e8ee",
};

const imgWrapperStyle: React.CSSProperties = {
  width: "100%",
  height: "140px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f3f6fa",
  borderRadius: "16px",
  marginBottom: "16px",
  overflow: "hidden",
  border: "1px solid #e0e0e0",
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

const badgeStyleBase: React.CSSProperties = {
  color: "#4a6fa1",
  background: "#e0eafc",
  borderRadius: "8px",
  padding: "4px 14px",
  fontWeight: 600,
  fontSize: "0.93rem",
  marginBottom: "8px",
  fontFamily: "'Poppins', sans-serif",
  letterSpacing: "0.03em",
  border: "none",
  maxWidth: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const titleStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "1.08rem",
  marginBottom: "6px",
  fontFamily: "'Poppins', sans-serif",
  color: "#222",
  textAlign: "left",
  maxWidth: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const descStyle: React.CSSProperties = {
  color: "#7b8aaf",
  fontSize: "0.99rem",
  marginBottom: "14px",
  fontFamily: "'Inter', sans-serif",
  textAlign: "left",
  maxWidth: "100%",
  minHeight: "40px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginBottom: "8px",
  fontSize: "0.95rem",
  color: "#7b8aaf",
  fontFamily: "'Inter', sans-serif",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const priceStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "1.1rem",
  color: "#4a6fa1",
  margin: "12px 0 0 0",
  fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
};

const buttonStyle: React.CSSProperties = {
  background: "#e0eafc",
  color: "#4a6fa1",
  border: "none",
  borderRadius: "12px",
  padding: "12px 28px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "1rem",
  marginTop: "auto",
  fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
  alignSelf: "center",
  boxShadow: "0 2px 8px rgba(179,157,219,0.13)",
  transition: "background 0.2s",
};

const checkoutBtnStyle: React.CSSProperties = {
  background: "#b39ddb", // Light purple
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "16px 0",
  width: "100%",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "1.1rem",
  marginTop: "auto",
  fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
  boxShadow: "0 2px 8px rgba(179,157,219,0.13)",
  transition: "background 0.2s",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(30,40,60,0.28)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(2px)",
};

const modalCardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "32px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
  padding: "36px 32px",
  width: "370px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
};

const closeBtnStyle: React.CSSProperties = {
  position: "absolute",
  top: 18,
  right: 24,
  background: "none",
  border: "none",
  fontSize: "1.7rem",
  color: "#aaa",
  cursor: "pointer",
  fontWeight: 700,
};

const drawerOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(30,40,60,0.18)",
  zIndex: 2000,
  display: "flex",
  justifyContent: "flex-end",
};

const drawerStyle: React.CSSProperties = {
  width: 400,
  maxWidth: "90vw",
  height: "100vh",
  background: "#fff",
  boxShadow: "-4px 0 32px rgba(0,0,0,0.12)",
  padding: "32px 0 0 0",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  zIndex: 2100,
  overflow: "hidden",
};

const checkoutBtnWrapperStyle: React.CSSProperties = {
  position: "absolute",
  left: 16,
  right: 16,
  bottom: 24,
  background: "#fff",
  padding: "16px",
  boxShadow: "0 -2px 16px rgba(120,144,156,0.07)",
  zIndex: 2200,
  borderTopLeftRadius: "24px",
  borderTopRightRadius: "24px",
  boxSizing: "border-box",
};

const cartContentStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "0 16px 140px 16px",
  boxSizing: "border-box",
};

const cartItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginBottom: 24,
  borderBottom: "1px solid #eee",
  paddingBottom: 16,
};

const cartImgStyle: React.CSSProperties = {
  width: 64,
  height: 64,
  objectFit: "cover",
  borderRadius: 8,
  background: "#f3f6fa",
  border: "1px solid #eee",
};

const cartTitleStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "1.05rem",
  marginBottom: 4,
};

const cartPriceStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "#7b1fa2",
  fontSize: "1.1rem",
};

const cartQtyStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginTop: 4,
};

function truncate(str: string, n: number) {
  return str && str.length > n ? str.slice(0, n - 1) + "…" : str;
}

function getCartTotal(cart: any[]) {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

const ListingPage: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dataParam = params.get("data");
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        setListings(parsed);
      } catch (e) {
        setListings([]);
      }
    } else {
      setListings([]);
    }
  }, [location.search]);

  const filteredListings = listings.filter((item) => {
    const searchTermMatch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.categoryDescription?.toLowerCase().includes(search.toLowerCase());
    return searchTermMatch;
  });

  function handleAddToCart(product: any) {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        // Increase quantity
        const updated = [...prev];
        updated[idx].qty += 1;
        return updated;
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartDrawerOpen(true);
  }

  function handleCartQtyChange(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function handleRemoveFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  // 1. Dismiss product detail modal when cart opens:
  useEffect(() => {
    if (cartDrawerOpen && selectedProduct) {
      setSelectedProduct(null);
    }
  }, [cartDrawerOpen, selectedProduct]);

  // When user clicks "Proceed to Checkout"
  function handleCheckout() {
    history.push("/customer-details", { cart }); // Pass cart as location state
  }

  return (
    <div style={pageStyle}>
      <div style={contentWrapperStyle}>
        <div style={headerStyle}>Find Your Dream Lights</div>
        <div style={searchStyle}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Search based on location, name, or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={cardContainerStyle}>
          {filteredListings.map((item, idx) => (
            <div
              key={item.id}
              style={{
                ...cardStyleBase,
                background: cardColors[idx % cardColors.length],
                cursor: "pointer",
              }}
              onClick={() => setSelectedProduct(item)}
            >
              <div style={imgWrapperStyle}>
                <img
                  src={
                    item.imageUrl && item.imageUrl !== "default.jpg"
                      ? item.imageUrl
                      : "https://img.icons8.com/ios-filled/200/light.png"
                  }
                  alt={item.name}
                  style={imgStyle}
                />
              </div>
              <div style={badgeStyleBase}>
                {truncate(item.categoryDescription || "Lighting", 18)}
              </div>
              <div style={titleStyle}>{truncate(item.title || item.name, 22)}</div>
              <div style={descStyle}>{truncate(item.description, 60)}</div>
              <div style={infoRowStyle}>
                <span>{truncate(`Order Code: ${item.orderCode}`, 18)}</span>
              </div>
              <div style={priceStyle}>₹{item.price} INR</div>
              <button style={buttonStyle} onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div style={overlayStyle} onClick={() => setSelectedProduct(null)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <button
              style={closeBtnStyle}
              onClick={() => setSelectedProduct(null)}
              aria-label="Close"
            >
              &times;
            </button>
            {/* Product detail content */}
            <div style={imgWrapperStyle}>
              <img
                src={
                  selectedProduct.imageUrl && selectedProduct.imageUrl !== "default.jpg"
                    ? selectedProduct.imageUrl
                    : "https://img.icons8.com/ios-filled/200/light.png"
                }
                alt={selectedProduct.name}
                style={imgStyle}
              />
            </div>
            <div
              style={{
                ...titleStyle,
                whiteSpace: "normal",
                overflow: "visible",
                textOverflow: "unset",
                fontSize: "1.25rem",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              {selectedProduct.title || selectedProduct.name}
            </div>
            <div
              style={{
                ...descStyle,
                whiteSpace: "pre-line",
                overflow: "visible",
                textOverflow: "unset",
                display: "block",
                WebkitLineClamp: "unset",
                WebkitBoxOrient: "unset",
                fontSize: "1.05rem",
                marginBottom: "18px",
                textAlign: "center",
              }}
            >
              {selectedProduct.description}
            </div>
            <div style={infoRowStyle}>
              <span>Order: {selectedProduct.orderCode}</span>
            </div>
            <div style={infoRowStyle}>
              <span>Category: {selectedProduct.categoryDescription}</span>
            </div>
            <div style={priceStyle}>For ₹{selectedProduct.price} INR</div>
            <button style={buttonStyle} onClick={() => handleAddToCart(selectedProduct)}>
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {cartDrawerOpen && (
        <div style={drawerOverlayStyle} onClick={() => setCartDrawerOpen(false)}>
          <div style={drawerStyle} onClick={e => e.stopPropagation()}>
            <button style={closeBtnStyle} onClick={() => setCartDrawerOpen(false)} aria-label="Close">
              &times;
            </button>
            <h2 style={{ fontWeight: 700, fontSize: "1.4rem", margin: "0 24px 24px 24px" }}>Cart</h2>
            <div style={cartContentStyle}>
              {cart.length === 0 ? (
                <div style={{ color: "#888", marginTop: 32 }}>Your cart is empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={cartItemStyle}>
                    <img
                      src={item.imageUrl && item.imageUrl !== "default.jpg"
                        ? item.imageUrl
                        : "https://img.icons8.com/ios-filled/200/light.png"}
                      alt={item.name}
                      style={cartImgStyle}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={cartTitleStyle}>{item.title || item.name}</div>
                      <div style={cartPriceStyle}>₹{item.price} INR</div>
                      <div style={cartQtyStyle}>
                        <button onClick={() => handleCartQtyChange(item.id, -1)} style={{ fontSize: 18, padding: "2px 8px" }}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => handleCartQtyChange(item.id, 1)} style={{ fontSize: 18, padding: "2px 8px" }}>+</button>
                        <button onClick={() => handleRemoveFromCart(item.id)} style={{ marginLeft: 12, color: "#fda085", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={checkoutBtnWrapperStyle}>
                <div style={{
                  fontWeight: 600,
                  margin: "0 0 12px 0",
                  textAlign: "right",
                  color: "#7b1fa2",
                  fontSize: "1.08rem"
                }}>
                  Subtotal: <span style={{ color: "#7b1fa2", fontWeight: 700 }}>₹{getCartTotal(cart)} INR</span>
                </div>
                <button style={checkoutBtnStyle} onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingPage;