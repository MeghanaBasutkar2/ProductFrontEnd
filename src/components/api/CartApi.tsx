const API_BASE = "http://localhost:9090/lighting/api/cart";
const getToken = () => document.cookie.match(/cart_token=([^;]+)/)?.[1];

// Helper to build If-Match header value
function buildIfMatch(cartToken: string | undefined, version: number | undefined) {
  if (!cartToken || typeof version !== "number") return undefined;
  return `cart-${cartToken}-v${version}`;
}

const headers = (ifMatch?: string) => {
  const base: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (ifMatch) base["If-Match"] = ifMatch;
  return base;
};

// --- Cart Version State (in-memory, update after every cart mutation) ---
let cartVersion: number | undefined = undefined;

// --- Fetch Cart (no If-Match header) ---
export async function fetchCart() {
  const res = await fetch(API_BASE, {
    credentials: "include",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();
  // Save latest version for future mutations
  cartVersion = data.version;
  return data;
}

// --- Add to Cart ---
export async function addToCart(productId: string, quantity: number) {
  const cartToken = getToken();
  const ifMatch = buildIfMatch(cartToken, cartVersion);
  const res = await fetch(`${API_BASE}/items`, {
    method: "POST",
    credentials: "include",
    headers: headers(ifMatch),
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  const data = await res.json();
  cartVersion = data.version;
  return data;
}

// --- Update Cart Item ---
export async function updateCartItem(itemId: string, quantity: number) {
  const cartToken = getToken();
  const ifMatch = buildIfMatch(cartToken, cartVersion);
  const res = await fetch(`${API_BASE}/items/${itemId}`, {
    method: "PUT",
    credentials: "include",
    headers: headers(ifMatch),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update cart item");
  const data = await res.json();
  cartVersion = data.version;
  return data;
}

// --- Remove Cart Item ---
export async function removeCartItem(itemId: string) {
  const cartToken = getToken();
  const ifMatch = buildIfMatch(cartToken, cartVersion);
  const res = await fetch(`${API_BASE}/items/${itemId}`, {
    method: "DELETE",
    credentials: "include",
    headers: headers(ifMatch),
  });
  if (!res.ok) throw new Error("Failed to remove cart item");
  const data = await res.json();
  cartVersion = data.version;
  return data;
}

// --- Clear Cart ---
export async function clearCart() {
  const cartToken = getToken();
  const ifMatch = buildIfMatch(cartToken, cartVersion);
  const res = await fetch(`${API_BASE}/items`, {
    method: "DELETE",
    credentials: "include",
    headers: headers(ifMatch),
  });
  if (!res.ok) throw new Error("Failed to clear cart");
  const data = await res.json();
  cartVersion = data.version;
  return data;
}
