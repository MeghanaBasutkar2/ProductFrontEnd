import React, { useEffect, useState } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation<{ product?: any; cart?: any[] }>();
  const history = useHistory();

  const [product, setProduct] = useState<any>(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [termsChecked, setTermsChecked] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cart, setCart] = useState<any[]>(location.state?.cart || []);

  useEffect(() => {
    if (!product) {
      fetch(`http://localhost:9090/lighting/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, product]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function handleAddToCart(item: any) {
    setCart((prev) => {
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

  function handleBuyNow() {
    if (!termsChecked) return;
    const buyNowCart = [{ ...product, qty: 1 }];
    history.push("/customer-details", { cart: buyNowCart });
  }

  const getCartTotal = () => cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (loading && !product) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div style={{ padding: "24px", fontFamily: "'Poppins', 'Inter', Arial, sans-serif" }}>
      <button
        style={{
          marginBottom: 18,
          background: "none",
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          padding: "6px 18px",
          color: "#7b1fa2",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
        }}
        onClick={() => history.goBack()}
      >
        &larr; Back
      </button>
      <h2 style={{ fontSize: "2rem", marginBottom: "16px" }}>{product.title || product.name}</h2>
      <div style={{ marginBottom: "16px" }}>
        <img
          src={product.imageUrl && product.imageUrl !== "default.jpg" ? product.imageUrl : "https://img.icons8.com/ios-filled/200/light.png"}
          alt={product.name}
          style={{ width: "100%", maxWidth: "400px", borderRadius: "16px" }}
        />
      </div>
      <p style={{ fontSize: "1rem", marginBottom: "12px" }}>{product.description}</p>
      <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "24px" }}>Price: ₹{product.price} INR</div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          style={{
            background: "#4a6fa1",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "12px 24px",
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={() => handleAddToCart(product)}
        >
          ADD TO CART
        </button>

        <button
          style={{
            background: termsChecked ? "#b39ddb" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "12px 24px",
            cursor: termsChecked ? "pointer" : "not-allowed",
            fontWeight: 700,
          }}
          onClick={handleBuyNow}
          disabled={!termsChecked}
        >
          BUY IT NOW
        </button>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <input
          type="checkbox"
          checked={termsChecked}
          onChange={() => setTermsChecked((prev) => !prev)}
          id="terms"
        />
        <label htmlFor="terms" style={{ marginLeft: "8px" }}>
          I agree to the terms & conditions
        </label>
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
                  Subtotal: <span style={{ color: "#7b1fa2", fontWeight: 700 }}>₹{getCartTotal()} INR</span>
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

export default ProductDetailPage;
