const API_BASE = "http://localhost:9090/lighting/api/cart";
const getToken = () => document.cookie.match(/cart_token=([^;]+)/)?.[1];

const headers = () => ({
  "Content-Type": "application/json",
  // Add other headers if needed
});

export async function fetchCart() {
  const res = await fetch(API_BASE, {
    credentials: "include",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToCart(productId: string, quantity: number) {
  const res = await fetch(`${API_BASE}/items`, {
    method: "POST",
    credentials: "include",
    headers: headers(),
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}

export async function updateCartItem(itemId: string, quantity: number) {
  const res = await fetch(`${API_BASE}/items/${itemId}`, {
    method: "PUT",
    credentials: "include",
    headers: headers(),
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Failed to update cart item");
  return res.json();
}

export async function removeCartItem(itemId: string) {
  const res = await fetch(`${API_BASE}/items/${itemId}`, {
    method: "DELETE",
    credentials: "include",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to remove cart item");
  return res.json();
}

export async function clearCart() {
  const res = await fetch(`${API_BASE}/items`, {
    method: "DELETE",
    credentials: "include",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Failed to clear cart");
  return res.json();
}
