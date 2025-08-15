import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

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

const buttonStyle: React.CSSProperties = {
  background: "#4a6fa1",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "10px 0", // Reduced vertical padding
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "1rem",
  fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
  alignSelf: "center",
  boxShadow: "0 2px 8px rgba(179,157,219,0.13)",
  transition: "background 0.2s",
  height: 40, // Fixed height for both buttons
  minWidth: 0,
};

const buyNowButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: "#fda085",
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

const ListingPage: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const filteredListings = listings.filter((item) =>
    (item.name || item.title || item.categoryDescription)?.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(item: any) {
    setCart((prev: any[]) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].qty += 1;
        return updated;
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setCartDrawerOpen(true);
  }

  function handleCartQtyChange(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function handleRemoveFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function handleCheckout() {
    history.push("/customer-details", { cart });
  }

  const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
        minHeight: "100vh",
        background: "#fafbfc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
            maxWidth: 400,
          }}
        >
          <input
            style={{
              width: "100%",
              padding: "12px 18px",
              borderRadius: 12,
              border: "1px solid #e0e0e0",
              fontSize: "1rem",
              fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
            }}
            type="text"
            placeholder="Search based on location, name, or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div style={cardContainerStyle}>
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
            <div style={{ fontWeight: 700, color: "#7b1fa2", fontSize: "1.1rem", marginBottom: 8 }}>
              ₹{item.price} INR
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
              width: 400,
              maxWidth: "90vw",
              height: "100vh",
              background: "#fff",
              padding: "32px 0 0 0",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
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

            <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 140px 16px" }}>
              {cart.length === 0 ? (
                <div style={{ color: "#888", marginTop: 32 }}>Your cart is empty.</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, borderBottom: "1px solid #eee", paddingBottom: 16 }}>
                    <img
                      src={item.imageUrl && item.imageUrl !== "default.jpg" ? item.imageUrl : "https://img.icons8.com/ios-filled/200/light.png"}
                      alt={item.name}
                      style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, background: "#f3f6fa", border: "1px solid #eee" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: 4 }}>{item.title || item.name}</div>
                      <div style={{ fontWeight: 700, color: "#7b1fa2", fontSize: "1.1rem" }}>₹{item.price} INR</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
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
              <div style={{ position: "absolute", left: 16, right: 16, bottom: 24, background: "#fff", padding: "16px", boxShadow: "0 -2px 16px rgba(120,144,156,0.07)", borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}>
                <div style={{ fontWeight: 600, margin: "0 0 12px 0", textAlign: "right", color: "#7b1fa2", fontSize: "1.08rem" }}>
                  Subtotal: <span style={{ color: "#7bfa2", fontWeight: 700 }}>₹{getCartTotal()} INR</span>
                </div>
                <button style={{ background: "#b39ddb", color: "#fff", border: "none", borderRadius: "12px", padding: "16px 0", width: "100%", cursor: "pointer", fontWeight: 700, fontSize: "1.1rem" }} onClick={handleCheckout}>
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