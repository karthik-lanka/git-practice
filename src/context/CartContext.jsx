import { createContext, useContext, useReducer, useCallback, useEffect } from "react";

const CartContext = createContext(null);

// Helper to get product identifier (supports both _id from MongoDB and id from mock)
const getProductId = (product) => product._id || product.id;

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) =>
          item.productId === action.payload.productId && item.size === action.payload.size
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === existing.productId && item.size === existing.size
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(item.productId === action.payload.productId && item.size === action.payload.size)
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload.productId && item.size === action.payload.size
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "LOAD_CART":
      return { ...state, items: action.payload };

    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const items = JSON.parse(saved);
        if (Array.isArray(items) && items.length > 0) {
          dispatch({ type: "LOAD_CART", payload: items });
        }
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = useCallback((product, size) => {
    const productId = getProductId(product);
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        size: size || product.sizes?.[0] || "One Size",
      },
    });
  }, []);

  const removeFromCart = useCallback((productId, size) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId, size } });
  }, []);

  const updateQuantity = useCallback((productId, size, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, size, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const cartCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
