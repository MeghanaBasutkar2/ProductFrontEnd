import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { fetchCart, addToCart, updateCartItem, removeCartItem } from "../components/api/CartApi";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation<{ product?: any; cart?: any[] }>();
  const history = useHistory();

  const [product, setProduct] = useState<any>(location.state?.product || null);
  const [loading, setLoading] = useState(!location.state?.product);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);

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

  // Fetch cart on mount
  useEffect(() => {
    async function loadCart() {
      const data = await fetchCart();
      setCart(
        (Array.isArray(data) ? data : []).map((item: any) => ({
          ...item,
          id: item.lineId,
          name: item.productName,
          qty: item.quantity,
          price: item.unitPrice,
        }))
      );
    }
    loadCart();
  }, []);

  // Add to cart using backend API and update cart from response
  async function handleAddToCart(item: any) {
    const data = await addToCart(item.id, 1);
    setCart(
      (Array.isArray(data) ? data : []).map((item: any) => ({
        ...item,
        id: item.lineId,
        name: item.productName,
        qty: item.quantity,
        price: item.unitPrice,
      }))
    );
    setCartDrawerOpen(true);
  }

  // Change quantity using backend API and update cart from response
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
      (Array.isArray(data) ? data : []).map((item: any) => ({
        ...item,
        id: item.lineId,
        name: item.productName,
        qty: item.quantity,
        price: item.unitPrice,
      }))
    );
  }

  // Remove from cart using backend API and update cart from response
  async function handleRemoveFromCart(lineId: string) {
    const data = await removeCartItem(lineId);
    setCart(
      (Array.isArray(data) ? data : []).map((item: any) => ({
        ...item,
        id: item.lineId,
        name: item.productName,
        qty: item.quantity,
        price: item.unitPrice,
      }))
    );
  }

  function handleCheckout() {
    history.push("/customer-details", { cart });
  }

  function handleBuyNow() {
    const buyNowCart = [{ ...product, qty: 1 }];
    history.push("/customer-details", { cart: buyNowCart });
  }

  const getCartTotal = () => cart.reduce((sum, item) => sum + getDisplayPrice(item) * item.qty, 0);

  // Share handler
  const handleShare = useCallback(() => {
    const shareData = {
      title: product.title || product.name || "Product",
      text: product.description || "",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  }, [product]);

  // Use discountedPrice if it's a valid number and >0, else use price
  function getDisplayPrice(item: any) {
    const discounted = Number(item.discountedPrice);
    if (!isNaN(discounted) && discounted > 0) {
      return discounted;
    }
    return Number(item.price);
  }

  if (loading && !product) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div
      style={{
        padding: window.innerWidth <= 700 ? "16px 0" : "24px 0",
        fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
        background: "#fafbfc",
        minHeight: "100vh",
        boxSizing: "border-box",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexDirection: window.innerWidth <= 700 ? "column" : "row",
          gap: window.innerWidth <= 700 ? 24 : 56,
          alignItems: window.innerWidth <= 700 ? "center" : "flex-start",
          justifyContent: "center",
          padding: window.innerWidth <= 700 ? "0 8px" : "0",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Main Product Image */}
        <div
          style={{
            flex: window.innerWidth <= 700 ? "unset" : "0 0 420px",
            display: "flex",
            justifyContent: "center",
            position: "relative",
            width: window.innerWidth <= 700 ? "100%" : 420,
            maxWidth: window.innerWidth <= 700 ? "100%" : 420,
            marginBottom: window.innerWidth <= 700 ? 20 : 0,
            boxSizing: "border-box",
          }}
        >
          <img
            src={
              product.imageUrl && product.imageUrl !== "default.jpg"
                ? product.imageUrl
                : "https://img.icons8.com/ios-filled/400/light.png"
            }
            alt={product.name}
            style={{
              width: "100%",
              maxWidth: window.innerWidth <= 700 ? "100%" : 380,
              height: window.innerWidth <= 700 ? "auto" : 320,
              objectFit: "cover",
              borderRadius: 16,
              background: "#f3f6fa",
              border: "1.5px solid #e0e0e0",
              boxShadow: "0 4px 24px rgba(120,144,156,0.08)",
            }}
          />
          {/* Share Button */}
          <button
            onClick={handleShare}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: "#fff",
              border: "1.5px solid #e0e0e0",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(179,157,219,0.10)",
              zIndex: 10,
              transition: "box-shadow 0.2s",
            }}
            aria-label="Share Product"
            title="Share Product"
          >
            <svg width="22" height="22" fill="none" stroke="#7b1fa2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
        {/* Product Details */}
        <div
          style={{
            flex: 1,
            minWidth: window.innerWidth <= 700 ? "unset" : 340,
            maxWidth: window.innerWidth <= 700 ? "100%" : 540,
            width: "100%",
            boxSizing: "border-box",
            padding: window.innerWidth <= 700 ? "0 2px" : 0,
          }}
        >
          <button
            style={{
              marginBottom: 18,
              background: "none",
              border: "1.5px solid #e0e0e0",
              borderRadius: 8,
              padding: "6px 18px",
              color: "#7b1fa2",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Poppins', 'Inter', Arial, sans-serif",
              letterSpacing: "0.01em",
              boxShadow: "0 2px 8px rgba(179,157,219,0.07)",
            }}
            onClick={() => history.goBack()}
          >
            &larr; Back
          </button>
          <div style={{
            fontWeight: 700,
            fontSize: "1.3rem",
            marginBottom: 8,
            color: "#222",
            letterSpacing: "0.01em",
            textShadow: "0 2px 12px rgba(123,31,162,0.06)"
          }}>
            {product.name}
          </div>
          <div style={{
            color: "#7b8aaf",
            fontSize: "0.98rem",
            marginBottom: 12,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.01em"
          }}>
            {product.productTypeHeading} &mdash; {product.categoryDisplayName}
          </div>
          <div style={{ margin: "24px 0 0 0" }}>
            <div style={{ fontWeight: 600, fontSize: "1.08rem", marginBottom: 6, color: "#222" }}>
              Product Details
            </div>
            <div style={{ color: "#7b8aaf", fontSize: "0.98rem", marginBottom: 10, whiteSpace: "pre-line" }}>
              {product.description1}
            </div>
            <div style={{ fontWeight: 600, fontSize: "1.08rem", marginBottom: 6, color: "#222" }}>
              Technical Details
            </div>
            <div style={{ color: "#7b8aaf", fontSize: "0.98rem", marginBottom: 10, whiteSpace: "pre-line" }}>
              {product.description2}
            </div>
            <div style={{ fontWeight: 600, fontSize: "1.08rem", marginBottom: 6, color: "#222" }}>
              Product Code
            </div>
            <div style={{ color: "#7b8aaf", fontSize: "0.98rem", marginBottom: 10 }}>
              {product.orderCode || product.id}
            </div>
            <div style={{ fontWeight: 600, fontSize: "1.08rem", marginBottom: 6, color: "#222" }}>
              Variants
            </div>
            <div style={{ color: "#7b8aaf", fontSize: "0.98rem", marginBottom: 18 }}>
              {[product.variant1, product.variant2, product.variant3].filter(Boolean).join(" | ")}
            </div>
          </div>
          <div style={{
            fontWeight: 700,
            color: "#7b1fa2",
            fontSize: "1.1rem",
            marginBottom: 18,
            letterSpacing: "0.01em"
          }}>
            {(!isNaN(Number(product.discountedPrice)) && Number(product.discountedPrice) > 0 && product.discountedPrice !== product.price) ? (
              <>
                <span style={{ textDecoration: "line-through", color: "#bdbdbd", marginRight: 8, fontWeight: 500 }}>
                  ₹{product.price}
                </span>
                <span style={{ color: "#fda085" }}>₹{product.discountedPrice} INR</span>
              </>
            ) : (
              <>₹{product.price} INR</>
            )}
          </div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button
              style={{
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
                flex: 1,
              }}
              onClick={() => handleAddToCart(product)}
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
              style={{
                background: "linear-gradient(90deg, #4f8cff 0%, #6f7bfd 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "10px 0",
                cursor: "pointer",
                fontWeight: 700,
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
                flex: 1,
              }}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
          <div style={{ marginBottom: "24px" }}>
            <span style={{ color: "#7b8aaf", fontSize: "0.98rem" }}>
              * By proceeding, you acknowledge and accept our terms and conditions.
            </span>
          </div>
        </div>
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
                        <div style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: 4 }}>
                          {item.title || item.name}
                        </div>
                        <div style={{ fontWeight: 700, color: "#7b1fa2", fontSize: "1.1rem" }}>
                          {(!isNaN(Number(item.discountedPrice)) && Number(item.discountedPrice) > 0 && item.discountedPrice !== item.price) ? (
                            <>
                              <span style={{ textDecoration: "line-through", color: "#bdbdbd", marginRight: 8, fontWeight: 500 }}>
                                ₹{item.price}
                              </span>
                              <span style={{ color: "#fda085" }}>₹{item.discountedPrice} INR</span>
                            </>
                          ) : (
                            <>₹{item.price} INR</>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                          <button onClick={() => handleCartQtyChange(item.id, -1)} style={{ fontSize: 18, padding: "2px 8px" }}>
                            -
                          </button>
                          <span>{item.qty}</span>
                          <button onClick={() => handleCartQtyChange(item.id, 1)} style={{ fontSize: 18, padding: "2px 8px" }}>
                            +
                          </button>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            style={{
                              marginLeft: 12,
                              color: "#fda085",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
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
                      color: "#7b1fa2",
                      fontSize: "1.08rem",
                      width: "100%",
                    }}
                  >
                    Subtotal:{" "}
                    <span style={{ color: "#7b1fa2", fontWeight: 700 }}>₹{getCartTotal()} INR</span>
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

export default ProductDetailPage;
