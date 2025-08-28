import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Lottie from "lottie-react";
import happyShopperLottie from "./HappyShopperLottie.json";
import { fetchCart, clearCart } from "../components/api/CartApi";

// --- Theme Colors ---
const purple = "#5b4c9a";
const blue = "#4f8cff";
const bgGradient = "linear-gradient(135deg, #f6f6f6 60%, #e9e9ff 100%)";
const cardBg = "#fff";

// --- Font similar to the image header (e.g., 'Orbitron', 'Rajdhani', or 'Exo') ---
const futuristicFont = "'Rajdhani', 'Orbitron', 'Exo', Arial, sans-serif";

// --- Styles ---
const pageStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  width: "100vw",
  background: bgGradient,
  fontFamily: futuristicFont,
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
};

const leftStyle: React.CSSProperties = {
  flex: 1,
  padding: "48px 32px 40px 32px",
  background: "none",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  minWidth: 340,
  maxWidth: 540,
};

const formCardStyle: React.CSSProperties = {
  background: cardBg,
  borderRadius: 20,
  boxShadow: "0 4px 24px rgba(120,144,156,0.10)",
  padding: "32px 28px 28px 28px",
  width: "100%",
  maxWidth: 480,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 0,
};

const sectionTitleStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "1.35rem",
  margin: "0 0 22px 0",
  color: blue,
  letterSpacing: "0.01em",
  fontFamily: futuristicFont,
  textTransform: "capitalize",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  marginBottom: 4, // Make this 4px for all labels for even spacing
  fontSize: "0.98rem",
  color: "#222",
  fontFamily: futuristicFont,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "14px 16px",
  borderRadius: 12,
  border: `2px solid #e0e0e0`,
  marginBottom: 16,
  fontSize: "1.08rem",
  fontFamily: futuristicFont,
  background: "#f8f9fb",
  boxSizing: "border-box",
  display: "block",
  outline: "none",
  transition: "border 0.2s",
  boxShadow: "0 2px 8px rgba(120,144,156,0.06)",
};

const inputRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 14,
  marginBottom: 16,
};

const labelInputColumn: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minWidth: 0,
};

const errorStyle: React.CSSProperties = {
  color: "#d32f2f",
  fontSize: "0.97rem",
  marginBottom: 10,
  minHeight: 20,
  display: "block",
};

const submitBtnStyle: React.CSSProperties = {
  marginTop: 16,
  background: `linear-gradient(90deg, ${blue} 0%, ${purple} 100%)`,
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "16px 0",
  width: "100%",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "1.1rem",
  fontFamily: futuristicFont,
  boxShadow: "0 2px 12px rgba(91,76,154,0.10)",
  transition: "background 0.2s",
  display: "block",
  letterSpacing: "0.01em",
};

const rightStyle: React.CSSProperties = {
  flex: 1,
  background: "#fff",
  padding: "36px 0 0 0",
  borderLeft: `1.5px solid #e0e0e0`,
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  boxShadow: "0 0 24px 0 rgba(120,144,156,0.06)",
  minWidth: 340,
  maxWidth: 540,
  overflow: "hidden", // Prevent scroll
};

const cartListStyle: React.CSSProperties = {
  flex: "0 1 auto",
  overflowY: "auto",
  padding: "0 24px 0 24px",
  marginBottom: 0,
  minHeight: 0,
  maxHeight: "calc(100vh - 320px)", // Limit cart height so payment is always visible
};

const cartItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 16,
  borderBottom: "1px solid #eee",
  paddingBottom: 10,
};

const cartImgStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  objectFit: "cover",
  borderRadius: 8,
  background: "#f6f6f6",
  border: "none",
};

const cartTitleStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "1.02rem",
  color: "#222",
  fontFamily: futuristicFont,
};

const cartPriceStyle: React.CSSProperties = {
  fontWeight: 700,
  color: blue,
  fontSize: "1.02rem",
  fontFamily: futuristicFont,
};

const summaryWrapperStyle: React.CSSProperties = {
  background: "#fff",
  borderTop: `1.5px solid #e0e0e0`,
  fontWeight: 700,
  fontSize: "1.08rem",
  color: blue,
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "0 24px",
  zIndex: 2,
  boxShadow: "0 -2px 12px 0 rgba(120,144,156,0.04)",
  position: "static",
  marginBottom: 90, // Give space for payment section
};

const paymentSectionStyle: React.CSSProperties = {
  margin: "0 24px 24px 24px",
  padding: "18px 16px",
  borderRadius: 14,
  background: "#f8f9fb",
  boxShadow: "0 2px 8px rgba(120,144,156,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 14,
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 10,
};

const paymentPlaceholderStyle: React.CSSProperties = {
  background: "#fff",
  border: "1.5px solid #e0e0e0",
  borderRadius: 10,
  padding: "12px 0",
  textAlign: "center",
  fontFamily: futuristicFont,
  fontWeight: 600,
  color: "#7b8aaf",
  fontSize: "1.08rem",
  marginBottom: 0,
  letterSpacing: "0.04em",
};

function getDisplayPrice(item: any) {
  const discounted = Number(item.discountedPrice);
  if (!isNaN(discounted) && discounted > 0 && discounted < Number(item.price)) {
    return discounted;
  }
  return Number(item.price);
}

function getCartTotal(cart: any[]) {
  return cart.reduce((sum, item) => getDisplayPrice(item) * item.qty + sum, 0);
}

const API_URL = "http://localhost:9090/lighting/api/orders/place-order";

const CustomerDetailPage: React.FC = () => {
  const history = useHistory();

  // --- Cart state from backend ---
  const [cart, setCart] = useState<any[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  // --- Form state ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch cart from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadCart() {
      const data = await fetchCart();
      if (isMounted) {
        setCart(
          Array.isArray(data.items)
            ? data.items.map((item: any) => {
                const price = Number(item.unitPrice);
                const discounted = Number(item.discountPrice);
                const validDiscount =
                  !isNaN(discounted) &&
                  discounted > 0 &&
                  discounted < price;
                return {
                  ...item,
                  id: item.lineId,
                  name: item.productName,
                  qty: item.quantity,
                  price,
                  discountedPrice: validDiscount ? discounted : null,
                };
              })
            : []
        );
        setCartLoaded(true);
      }
    }
    loadCart();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !phone.trim() || !email.trim()) {
      setError("First name, phone number, and email are required.");
      return;
    }
    setError("");
    setLoading(true);

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
          id: item.productId,
          name: item.title || item.name,
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

      // Clear cart after successful order
      await clearCart();
      setCart([]);
      setShowSuccess(true);
      setLoading(false);

      // Do NOT navigate to listing page after placing order
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
    backdropFilter: "blur(12px)",
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

  // Show nothing until cart is loaded (prevents flicker/redirect loop)
  if (!cartLoaded) return null;

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
          <div style={sectionTitleStyle}>Contact information</div>
          <div style={inputRowStyle}>
            <div style={labelInputColumn}>
              <label style={labelStyle}>First Name</label>
              <input
                id="firstName"
                name="firstName"
                style={inputStyle}
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First Name"
                autoComplete="given-name"
                required
              />
            </div>
            <div style={{ width: 14 }} /> {/* gap between columns */}
            <div style={labelInputColumn}>
              <label style={labelStyle}>Last Name</label>
              <input
                id="lastName"
                name="lastName"
                style={inputStyle}
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last Name"
                autoComplete="family-name"
              />
            </div>
          </div>
          <div style={labelInputColumn}>
            <label style={labelStyle}>Phone Number</label>
            <input
              id="phone"
              name="phone"
              style={inputStyle}
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Phone Number"
              autoComplete="tel"
              required
            />
          </div>
          <div style={labelInputColumn}>
            <label style={labelStyle}>Email</label>
            <input
              id="email"
              name="email"
              style={inputStyle}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              required
            />
          </div>
          <div style={inputRowStyle}>
            <div style={{ ...labelInputColumn, flex: 2 }}>
              <label style={labelStyle}>Address</label>
              <input
                id="address"
                name="address"
                style={inputStyle}
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Address"
                autoComplete="street-address"
              />
            </div>
            <div style={{ width: 14 }} />
            <div style={{ ...labelInputColumn, flex: 1 }}>
              <label style={labelStyle}>Pincode</label>
              <input
                id="pincode"
                name="pincode"
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
                  {(typeof item.discountedPrice === "number" &&
                    !isNaN(item.discountedPrice) &&
                    item.discountedPrice > 0 &&
                    item.discountedPrice < item.price) ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: "#bdbdbd", marginRight: 8, fontWeight: 500 }}>
                        ₹{item.price}
                      </span>
                      <span style={{ color: "#4f8cff" }}>₹{item.discountedPrice} × {item.qty}</span>
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
          <span style={{ color: blue, fontWeight: 700 }}>
            Subtotal:
          </span>
          <span style={{ color: blue, fontWeight: 800, marginLeft: 8 }}>
            ₹{getCartTotal(cart)} INR
          </span>
        </div>
        {/* Payment placeholders always visible at the bottom */}
        <div style={paymentSectionStyle}>
          <div style={paymentPlaceholderStyle}>UPI / QR Code (Coming Soon)</div>
          <div style={paymentPlaceholderStyle}>Credit / Debit Card (Coming Soon)</div>
          <div style={paymentPlaceholderStyle}>Net Banking (Coming Soon)</div>
          <div style={paymentPlaceholderStyle}>Pay on Delivery</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;