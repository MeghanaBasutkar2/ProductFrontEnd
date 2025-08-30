import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Lottie from "lottie-react";
import happyShopperLottie from "../components/lottie/happy-shopper-lottie.json";
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
  position: "fixed",
  inset: 0,
  minHeight: "100vh",
  width: "100vw",
  background: bgGradient,
  fontFamily: futuristicFont,
  margin: 0,
  padding: 0,
  boxSizing: "border-box",
  border: "none",
  overflow: "auto",
};

const contentWrapperStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  width: "100vw",
  height: "100vh",
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
  gap: window.innerWidth > 700 ? 4 : 0, // Further reduce gap between panels on desktop
  justifyContent: 'center',
  alignItems: 'flex-start',
};

const leftStyle: React.CSSProperties = {
  flex: 1,
  width: window.innerWidth > 700 ? "50vw" : "100vw",
  minWidth: window.innerWidth > 700 ? 340 : undefined,
  maxWidth: window.innerWidth > 700 ? "50vw" : undefined,
  padding: 0, // Remove all padding!
  background: "none",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  boxSizing: "border-box",
};

const formCardStyle: React.CSSProperties = {
  background: cardBg,
  borderRadius: 20,
  boxShadow: "0 4px 24px rgba(120,144,156,0.10)",
  padding: "32px 32px 28px 32px", // Increased right padding to 32px to match left/start
  width: "100%",
  maxWidth: 480,
  margin: 16,
  display: "flex",
  flexDirection: "column",
  gap: 0,
  boxSizing: "border-box",
};

const sectionTitleStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "1.35rem",
  margin: "0 0 22px 0",
  color: blue,
  letterSpacing: "0.01em",
  fontFamily: "'Inter', Arial, sans-serif",
  textTransform: "capitalize",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 500,
  marginBottom: 4, // Make this 4px for all labels for even spacing
  fontSize: "0.98rem",
  color: "#222",
  fontFamily: "'Inter', Arial, sans-serif",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 0,
  padding: "14px 16px",
  borderRadius: 12,
  border: `2px solid #e0e0e0`,
  marginBottom: 8, // Reduced from 16 to 8 for tighter spacing
  fontSize: "1.08rem",
  fontFamily: "'Inter', Arial, sans-serif",
  background: "#f8f9fb",
  boxSizing: "border-box",
  display: "block",
  outline: "none",
  transition: "border 0.2s",
  boxShadow: "0 2px 8px rgba(120,144,156,0.06)",
};

const inputRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 10, // Reduced from 14 to 10 for tighter horizontal spacing
  marginBottom: 8, // Reduced from 16 to 8 for tighter vertical spacing
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
  background: blue,
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "16px 0",
  width: "100%",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "1.1rem",
  fontFamily: "'Inter', Arial, sans-serif",
  boxShadow: "0 2px 12px rgba(91,76,154,0.10)",
  transition: "background 0.2s",
  display: "block",
  letterSpacing: "0.01em",
};

const rightStyle: React.CSSProperties = {
  flex: 1,
  background: "none",
  padding: window.innerWidth <= 700 ? "18px 0 0 0" : "36px 0 0 0",
  borderLeft: window.innerWidth <= 700 ? "none" : `1.5px solid #e0e0e0`,
  display: "flex",
  flexDirection: "column",
  position: "relative",
  alignItems: "center",
  minWidth: window.innerWidth <= 700 ? 0 : 340,
  maxWidth: 540,
  boxSizing: "border-box",
};

const cartListStyle: React.CSSProperties = {
  flex: "0 1 auto",
  overflowY: "auto",
  padding: "0 24px 0 24px",
  marginBottom: 0,
  minHeight: 0,
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
  fontWeight: 1000,
  fontSize: "1.08rem",
  color: "#182c4bff",
  fontFamily: "'Roboto', 'Arial', sans-serif",
  letterSpacing: "0.01em",
  marginBottom: 2,
};

const cartPriceStyle: React.CSSProperties = {
  fontWeight: 700,
  color: blue,
  fontSize: "1.02rem",
  fontFamily: "'Inter', Arial, sans-serif",
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
  fontFamily: "'Inter', Arial, sans-serif",
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

  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);

  const formCardRef = useRef<HTMLFormElement>(null);
  const [formCardHeight, setFormCardHeight] = React.useState<number>(0);

  // Measure the height of the contact info box after mount and on resize
  React.useEffect(() => {
    function updateHeight() {
      if (formCardRef.current) {
        setFormCardHeight(formCardRef.current.offsetHeight);
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [firstName, lastName, phone, email, address, pincode, error, loading]);

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
    <>
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
              <h2 style={{ color: purple, margin: "8px 0 8px 0", fontFamily: "'Inter', Arial, sans-serif" }}>You’re all set!</h2>
              <div style={{ color: blue, fontSize: "1.08rem", marginBottom: 12, fontFamily: "'Inter', Arial, sans-serif" }}>
                You can now pay on the go.<br />Thank you for shopping with us!
              </div>
            </div>
          </>
        )}
        <div style={contentWrapperStyle}>
          {/* Contact Info (left) */}
          <div style={{ ...leftStyle, position: 'relative' }}>
            <form
              ref={formCardRef}
              style={{
                ...formCardStyle,
                minHeight: window.innerWidth > 700 ? '60vh' : undefined,
                maxHeight: window.innerWidth > 700 ? '80vh' : undefined,
                marginTop: window.innerWidth > 700 ? 32 : 24,
                marginBottom: window.innerWidth > 700 ? 0 : 24,
                marginLeft: 16,
                marginRight: 16,
                width: window.innerWidth <= 700 ? 'calc(100vw - 32px)' : '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                gap: 0,
                position: 'relative',
              }}
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div style={sectionTitleStyle}>Contact Information</div>
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
            {/* Show collapse/expand button only on mobile */}
            {window.innerWidth <= 700 && (
              <button
                style={{
                  position: 'absolute',
                  top: formCardRef.current ? (formCardRef.current.offsetHeight / 2 - 22) : '50%',
                  right: -8,
                  transform: 'translateY(0)',
                  background: '#fff',
                  border: '1.5px solid #e0e0e0',
                  borderRadius: '50%',
                  width: 44,
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(179,157,219,0.10)',
                  transition: 'box-shadow 0.2s, transform 0.18s cubic-bezier(.4,2,.6,1)',
                  zIndex: 10,
                }}
                aria-label="Open Cart"
                title="Open Cart"
                onClick={() => setCartSidebarOpen(true)}
              >
                {/* Cart icon SVG */}
                <img src={require('../assets/cart.svg').default} alt="Open Cart" style={{ width: 28, height: 28, display: 'block' }} />
              </button>
            )}
          </div>
          {/* Cart (right) - always visible on desktop, collapsible on mobile */}
          {window.innerWidth > 700 ? (
            <div style={{
              ...rightStyle,
              background: '#fff',
              borderRadius: 24,
              margin: '32px 0 32px 0', // Remove left margin for tighter layout
              boxShadow: '-8px 0 32px 0 rgba(120,144,156,0.13)',
              minHeight: '60vh',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
              padding: 0,
              alignItems: 'flex-start',
            }}>
              <div style={{
                ...sectionTitleStyle,
                fontSize: '1.18rem',
                margin: '32px 0 18px 24px',
                color: blue,
                letterSpacing: 0.5,
                fontWeight: 600,
                textAlign: 'left',
                width: '100%',
                display: 'block',
                fontFamily: "'Inter', Arial, sans-serif",
                textTransform: 'none',
              }}>Cart</div>
              <div style={{
                ...cartListStyle,
                maxHeight: formCardHeight ? formCardHeight : 500,
                overflowY: 'auto',
                minHeight: 0,
                padding: '0 24px 0 24px',
              }}>
                {cart.map(item => (
                  <div key={item.id} style={{
                    ...cartItemStyle,
                    background: '#f6f8ff',
                    borderRadius: 12,
                    marginBottom: 14,
                    boxShadow: '0 2px 8px rgba(120,144,156,0.06)',
                    padding: '10px 16px',
                    border: 'none',
                    alignItems: 'center',
                    display: 'flex',
                  }}>
                    <img
                      src={item.imageUrl && item.imageUrl !== 'default.jpg'
                        ? item.imageUrl
                        : 'https://img.icons8.com/ios-filled/200/light.png'}
                      alt={item.name}
                      style={{ ...cartImgStyle, width: 40, height: 40, borderRadius: 8, marginRight: 10 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ ...cartTitleStyle, fontWeight: 800, fontSize: '1.08rem', color: '#232526', marginBottom: 2 }}>{item.title || item.name}</div>
                      <div style={{ ...cartPriceStyle, color: '#4f8cff', fontWeight: 700, fontSize: '1.08rem' }}>
                        {(typeof item.discountedPrice === 'number' &&
                          !isNaN(item.discountedPrice) &&
                          item.discountedPrice > 0 &&
                          item.discountedPrice < item.price) ? (
                          <>
                            <span style={{ textDecoration: 'line-through', color: '#bdbdbd', marginRight: 8, fontWeight: 500 }}>
                              ₹{item.price}
                            </span>
                            <span style={{ color: '#4f8cff', fontWeight: 700 }}>₹{item.discountedPrice} × {item.qty}</span>
                          </>
                        ) : (
                          <>₹{item.price} × {item.qty}</>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                ...summaryWrapperStyle,
                background: 'none',
                borderTop: 'none',
                borderRadius: '0 0 24px 24px',
                marginBottom: 0,
                boxShadow: 'none',
                fontWeight: 800,
                fontSize: '1.13rem',
                color: '#4f8cff',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                padding: '0 24px',
                textAlign: 'left',
                flexDirection: 'column',
                width: '100%',
                display: 'block',
              }}>
                <span style={{ fontWeight: 800, color: '#4f8cff', fontFamily: "'Inter', Arial, sans-serif", fontSize: '1.13rem', letterSpacing: '0.04em', userSelect: 'none', marginTop: 10, marginBottom: 2, textAlign: 'left', display: 'block' }}>
                  Subtotal: ₹{getCartTotal(cart)}
                </span>
              </div>
            </div>
          ) : (
            // Mobile: show collapsible cart drawer
            <>
              {cartSidebarOpen && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(30,40,60,0.18)',
                    zIndex: 2000,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    transition: 'background 0.2s cubic-bezier(.4,2,.6,1)',
                  }}
                  onClick={() => setCartSidebarOpen(false)}
                >
                  <div
                    style={{
                      width: '100vw',
                      height: '100vh',
                      background: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 -2px 24px 0 rgba(120,144,156,0.10)',
                      borderLeft: 'none',
                      borderTopLeftRadius: 32,
                      borderBottomLeftRadius: 32,
                      animation: 'slideInCartDrawer 0.4s cubic-bezier(.4,2,.6,1)',
                      padding: 0,
                      margin: 0,
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundImage: undefined,
                      transition: 'box-shadow 0.25s cubic-bezier(.4,2,.6,1), background 0.25s cubic-bezier(.4,2,.6,1)',
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0 18px 12px', justifyContent: 'space-between' }}>
                      <div style={{ ...sectionTitleStyle, fontSize: '1.25rem', color: blue, letterSpacing: 1.2, fontWeight: 800, margin: 0 }}>Cart</div>
                      <button
                        style={{
                          marginLeft: 12,
                          background: 'none',
                          border: 'none',
                          borderRadius: '50%',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: 'none',
                          zIndex: 10,
                          transition: 'background 0.2s, transform 0.18s cubic-bezier(.4,2,.6,1)',
                        }}
                        aria-label="Close Cart"
                        title="Close Cart"
                        onClick={() => setCartSidebarOpen(false)}
                      >
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <line x1="8" y1="8" x2="20" y2="20" stroke={blue} strokeWidth="2.5" strokeLinecap="round"/>
                          <line x1="20" y1="8" x2="8" y2="20" stroke={blue} strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                    <div
                      style={{
                        ...cartListStyle,
                        maxHeight: formCardHeight ? formCardHeight : 500,
                        overflowY: 'auto',
                        minHeight: 0,
                        padding: '0 12px 0 12px',
                      }}
                    >
                      {cart.map(item => (
                        <div key={item.id} style={{
                          ...cartItemStyle,
                          background: '#f6f8ff',
                          borderRadius: 12,
                          marginBottom: 14,
                          boxShadow: '0 2px 8px rgba(120,144,156,0.06)',
                          padding: '10px 8px',
                          border: 'none',
                          alignItems: 'center',
                          display: 'flex',
                        }}>
                          <img
                            src={item.imageUrl && item.imageUrl !== 'default.jpg'
                              ? item.imageUrl
                              : 'https://img.icons8.com/ios-filled/200/light.png'}
                            alt={item.name}
                            style={{ ...cartImgStyle, width: 40, height: 40, borderRadius: 8, marginRight: 10 }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ ...cartTitleStyle, fontWeight: 800, fontSize: '1.08rem', color: '#232526', marginBottom: 2 }}>{item.title || item.name}</div>
                            <div style={{ ...cartPriceStyle, color: '#4f8cff', fontWeight: 700, fontSize: '1.08rem' }}>
                              {(typeof item.discountedPrice === 'number' &&
                                !isNaN(item.discountedPrice) &&
                                item.discountedPrice > 0 &&
                                item.discountedPrice < item.price) ? (
                                <>
                                  <span style={{ textDecoration: 'line-through', color: '#bdbdbd', marginRight: 8, fontWeight: 500 }}>
                                    ₹{item.price}
                                  </span>
                                  <span style={{ color: '#4f8cff', fontWeight: 700 }}>₹{item.discountedPrice} × {item.qty}</span>
                                </>
                              ) : (
                                <>₹{item.price} × {item.qty}</>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{
                      ...summaryWrapperStyle,
                      background: 'none',
                      borderTop: 'none',
                      borderRadius: '0 0 24px 24px',
                      marginBottom: 0,
                      boxShadow: 'none',
                      fontWeight: 800,
                      fontSize: '1.13rem',
                      color: '#4f8cff',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      padding: '0 12px',
                    }}>
                      <span style={{ fontWeight: 800, color: '#4f8cff', fontFamily: "'Inter', Arial, sans-serif", fontSize: '1.13rem', letterSpacing: '0.04em', userSelect: 'none' }}>
                        Subtotal:
                      </span>
                      <span style={{ fontWeight: 800, color: '#4f8cff', fontFamily: "'Inter', Arial, sans-serif", fontSize: '1.13rem', letterSpacing: '0.04em', marginLeft: 8, userSelect: 'none' }}>
                        ₹{getCartTotal(cart)} INR
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerDetailPage;