import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Lottie from "lottie-react";
import happyShopperLottie from "./HappyShopperLottie.json";

// --- Theme Colors ---
const purple = "#7b1fa2";
const blue = "#3949ab";
const bgGradient = "linear-gradient(135deg, #e3e6ff 0%, #f3e7fa 100%)";
const cardBg = "rgba(255,255,255,0.98)";

// --- Styles ---
const pageStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  background: bgGradient,
  fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
};

const leftStyle: React.CSSProperties = {
  flex: 1,
  padding: "48px 48px 40px 80px",
  background: "none",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  minWidth: 340,
  maxWidth: 540,
};

const formCardStyle: React.CSSProperties = {
  background: cardBg,
  borderRadius: 24,
  boxShadow: "0 8px 32px rgba(123,31,162,0.08)",
  padding: "36px 32px 32px 32px",
  width: "100%",
  maxWidth: 480,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 0,
};

const sectionTitleStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "1.5rem",
  margin: "0 0 24px 0",
  color: purple,
  letterSpacing: "0.01em",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  marginBottom: 6,
  fontSize: "1rem",
  color: blue,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "13px 16px",
  borderRadius: 10,
  border: `1.5px solid ${purple}`,
  marginBottom: 18,
  fontSize: "1.08rem",
  fontFamily: "'Inter', Arial, sans-serif",
  background: "#f7f7fa",
  boxSizing: "border-box",
  display: "block",
  outline: "none",
  transition: "border 0.2s",
};

const inputRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 16,
  marginBottom: 18,
};

const errorStyle: React.CSSProperties = {
  color: "#d32f2f",
  fontSize: "0.98rem",
  marginBottom: 12,
  minHeight: 22,
  display: "block",
};

const submitBtnStyle: React.CSSProperties = {
  marginTop: 18,
  background: `linear-gradient(90deg, ${purple} 0%, ${blue} 100%)`,
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "16px 0",
  width: "100%",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "1.13rem",
  fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
  boxShadow: "0 2px 12px rgba(123,31,162,0.10)",
  transition: "background 0.2s",
  display: "block",
  letterSpacing: "0.02em",
};

const rightStyle: React.CSSProperties = {
  width: 400,
  background: "rgba(255,255,255,0.97)",
  padding: "40px 0 0 0",
  borderLeft: `2px solid ${purple}22`,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  boxShadow: "0 0 32px 0 rgba(123,31,162,0.04)",
};

const cartListStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "0 32px 0 32px",
  marginBottom: 0,
  minHeight: 0,
};

const cartItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 18,
  borderBottom: "1px solid #eee",
  paddingBottom: 12,
};

const cartImgStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  objectFit: "cover",
  borderRadius: 8,
  background: "#f3f6fa",
  border: "1px solid #eee",
};

const cartTitleStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "1.08rem",
  color: purple,
};

const cartPriceStyle: React.CSSProperties = {
  fontWeight: 700,
  color: blue,
  fontSize: "1.08rem",
};

const summaryWrapperStyle: React.CSSProperties = {
  position: "sticky",
  bottom: 0,
  left: 0,
  right: 0,
  background: "rgba(255,255,255,0.97)",
  borderTop: `2px solid ${purple}22`,
  textAlign: "right",
  fontWeight: 700,
  fontSize: "1.15rem",
  color: purple,
  height: 64,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "0 32px",
  zIndex: 2,
  boxShadow: "0 -2px 16px 0 rgba(123,31,162,0.04)",
};

function getDisplayPrice(item: any) {
  const discounted = Number(item.discountedPrice);
  if (!isNaN(discounted) && discounted > 0) {
    return discounted;
  }
  return Number(item.price);
}

function getCartTotal(cart: any[]) {
  return cart.reduce((sum, item) => sum + getDisplayPrice(item) * item.qty, 0);
}

const API_URL = "http://localhost:9090/lighting/api/orders/place-order";

const CustomerDetailPage: React.FC = () => {
  const location = useLocation<{ cart: any[] }>();
  const history = useHistory();
  const cart = location.state?.cart || [];

  if (!cart.length) {
    history.replace("/listings");
    return null;
  }

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validate all fields
    if (!firstName.trim() || !phone.trim() || !email.trim()) {
      setError("First name, phone number, and email are required.");
      return;
    }
    setError("");
    setLoading(true);

    // Prepare request body as per new API structure
    const subtotal = getCartTotal(cart);
    const reqBody = {
      customer: {
        firstName,
        lastName,
        email,
        phone,
        address,
        pincode,
      },
      subtotal,
      order: {
        productList: cart.map(item => ({
          id: item.id,
          name: item.title || item.name, // Use "name" as per API
          price: item.price,
          quantity: item.qty,
        })),
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      if (!response.ok) {
        throw new Error("Order failed. Please try again.");
      }

      setLoading(false);
      setShowSuccess(true);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Order failed. Please try again.");
    }
  }

  // --- Success Dialog Styles ---
  const dialogOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(60, 40, 120, 0.25)",
    backdropFilter: "blur(12px)", // Strong, instant blur
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "backdrop-filter 0.6s cubic-bezier(0.4,0,0.2,1), background 0.6s cubic-bezier(0.4,0,0.2,1)",
    opacity: 1,
    pointerEvents: "none",
  };

  const dialogBoxStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 8px 32px rgba(123,31,162,0.18)",
    padding: "28px 20px 24px 20px",
    maxWidth: 300,
    width: "90vw",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "fixed",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 1,
    transition: "opacity 0.4s",
    zIndex: 10000,
  };

  const lottieStyle: React.CSSProperties = {
    width: 120,
    height: 120,
    marginBottom: 12,
  };

  return (
    <div style={pageStyle}>
      {showSuccess && (
        <>
          <div style={dialogOverlayStyle}></div>
          <div style={dialogBoxStyle}>
            <Lottie
              animationData={happyShopperLottie}
              loop
              autoplay
              style={lottieStyle}
            />
            <h2 style={{ color: purple, margin: "8px 0 8px 0" }}>You’re all set!</h2>
            <div style={{ color: blue, fontSize: "1.08rem", marginBottom: 12 }}>
              You can now pay on the go.<br />Thank you for shopping with us!
            </div>
          </div>
        </>
      )}

      <div style={leftStyle}>
        <form style={formCardStyle} onSubmit={handleSubmit} autoComplete="off">
          <div style={sectionTitleStyle}>Contact Information</div>
          <div style={inputRowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>First Name</label>
              <input
                style={inputStyle}
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First Name"
                autoComplete="given-name"
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Last Name</label>
              <input
                style={inputStyle}
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last Name"
                autoComplete="family-name"
              />
            </div>
          </div>
          <label style={labelStyle}>Phone Number</label>
          <input
            style={inputStyle}
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Phone Number"
            autoComplete="tel"
            required
          />
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
          />
          <div style={inputRowStyle}>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Address</label>
              <input
                style={inputStyle}
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Address"
                autoComplete="street-address"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Pincode</label>
              <input
                style={inputStyle}
                type="text"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="Pincode"
                autoComplete="postal-code"
              />
            </div>
          </div>
          <span style={errorStyle}>{error}</span>
          <button style={submitBtnStyle} type="submit" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
      <div style={rightStyle}>
        <div style={{ ...sectionTitleStyle, fontSize: "1.25rem", margin: "0 0 18px 32px" }}>Your Cart</div>
        <div style={cartListStyle}>
          {cart.map(item => (
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
                <div style={cartPriceStyle}>
                  {(!isNaN(Number(item.discountedPrice)) && Number(item.discountedPrice) > 0 && item.discountedPrice !== item.price) ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: "#bdbdbd", marginRight: 8, fontWeight: 500 }}>
                        ₹{item.price}
                      </span>
                      <span style={{ color: "#fda085" }}>₹{item.discountedPrice} × {item.qty}</span>
                    </>
                  ) : (
                    <>₹{item.price} × {item.qty}</>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={summaryWrapperStyle}>
          Subtotal: <span style={{ color: purple, fontWeight: 800, marginLeft: 8 }}>₹{getCartTotal(cart)} INR</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;