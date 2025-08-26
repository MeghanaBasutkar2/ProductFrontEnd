const API_BASE = "http://localhost:9090/lighting/api/cart";

// Store latest cartToken and version from API responses
let cartToken: string | undefined = undefined;
let cartVersion: number | undefined = undefined;

// Helper to build If-Match header value
function buildIfMatch() {
  if (!cartToken || typeof cartVersion !== "number") return undefined;
  return `cart-${cartToken}-v${cartVersion}`;
}

const headers = (ifMatch?: string) => {
  const base: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (ifMatch) base["If-Match"] = ifMatch;
  return base;
};

// --- Fetch Cart (no If-Match header) ---
export async function fetchCart() {
  const res = await fetch(API_BASE, {
    credentials: "include",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();
  cartToken = data.cartToken;   // <-- Store latest cartToken from response
  cartVersion = data.version;
  return data;
}

// --- Add to Cart ---
export async function addToCart(productId: string, quantity: number) {
  const ifMatch = buildIfMatch();
  const res = await fetch(`${API_BASE}/items`, {
    method: "POST",
    credentials: "include",
    headers: headers(ifMatch),
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  const data = await res.json();
  cartToken = data.cartToken;   // <-- Store latest cartToken from response
  cartVersion = data.version;
  return data;
}

// --- Update Cart Item ---
export async function updateCartItem(itemId: string, quantity: number) {
  const ifMatch = buildIfMatch();
  const res = await fetch(`${API_BASE}/items/${itemId}`, {
    method: "PUT",
    credentials: "include",
    headers: headers(ifMatch),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update cart item");
  const data = await res.json();
  cartToken = data.cartToken;   // <-- Store latest cartToken from response
  cartVersion = data.version;
  return data;
}

// --- Remove Cart Item ---
export async function removeCartItem(itemId: string) {
  const ifMatch = buildIfMatch();
  const res = await fetch(`${API_BASE}/items/${itemId}`, {
    method: "DELETE",
    credentials: "include",
    headers: headers(ifMatch),
  });
  if (!res.ok) throw new Error("Failed to remove cart item");
  const data = await res.json();
  cartToken = data.cartToken;   // <-- Store latest cartToken from response
  cartVersion = data.version;
  return data;
}

// --- Clear Cart ---
export async function clearCart() {
  const ifMatch = buildIfMatch();
  const res = await fetch(`${API_BASE}/items`, {
    method: "DELETE",
    credentials: "include",
    headers: headers(ifMatch),
  });
  if (!res.ok) throw new Error("Failed to clear cart");
  const data = await res.json();
  cartToken = data.cartToken;   // <-- Store latest cartToken from response
  cartVersion = data.version;
  return data;
}
