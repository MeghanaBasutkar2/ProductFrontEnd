import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchCart, addToCart, updateCartItem, removeCartItem } from "../components/api/CartApi";

type CartItem = {
  id: string;
  productId: string;
  name: string;
  title?: string;
  qty: number;
  price: number;
  discountedPrice?: number | null;
  imageUrl?: string;
  [key: string]: any;
};

type CartContextType = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  handleAdd: (item: any) => Promise<void>;
  handleCartQtyChange: (lineId: string, delta: number) => Promise<void>;
  handleRemoveFromCart: (lineId: string) => Promise<void>;
  getDisplayPrice: (item: CartItem) => number;
  getCartTotal: () => number;
  reloadCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

function getDisplayPrice(item: CartItem) {
  const discounted = Number(item.discountedPrice);
  if (
    typeof discounted === "number" &&
    !isNaN(discounted) &&
    discounted > 0 &&
    discounted < Number(item.price)
  ) {
    return discounted;
  }
  return Number(item.price);
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Always map backend cart items to frontend shape
  const mapCartItems = useCallback((items: any[]): CartItem[] =>
    items.map((item: any) => {
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
    }), []
  );

  // Fetch cart on mount
  const reloadCart = useCallback(async () => {
    const data = await fetchCart();
    setCart(Array.isArray(data.items) ? mapCartItems(data.items) : []);
  }, [mapCartItems]);

  useEffect(() => {
    reloadCart();
  }, [reloadCart]);

  // Add to cart
  const handleAdd = useCallback(async (item: any) => {
    const data = await addToCart(item.id, 1);
    setCart(Array.isArray(data.items) ? mapCartItems(data.items) : []);
  }, [mapCartItems]);

  // Change quantity
  const handleCartQtyChange = useCallback(async (lineId: string, delta: number) => {
    const cartItem = cart.find((i) => i.id === lineId);
    if (!cartItem) return;
    const newQty = cartItem.qty + delta;
    let data;
    if (newQty <= 0) {
      data = await removeCartItem(cartItem.id);
    } else {
      data = await updateCartItem(cartItem.id, newQty);
    }
    setCart(Array.isArray(data.items) ? mapCartItems(data.items) : []);
  }, [cart, mapCartItems]);

  // Remove from cart
  const handleRemoveFromCart = useCallback(async (lineId: string) => {
    const data = await removeCartItem(lineId);
    setCart(Array.isArray(data.items) ? mapCartItems(data.items) : []);
  }, [mapCartItems]);

  // Cart total
  const getCartTotal = useCallback(() =>
    cart.reduce((sum, item) => getDisplayPrice(item) * item.qty + sum, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        handleAdd,
        handleCartQtyChange,
        handleRemoveFromCart,
        getDisplayPrice,
        getCartTotal,
        reloadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};