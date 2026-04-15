import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/api";

export default function Cart() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } =
    useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div
        id="cart-page"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
      >
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-light mb-2">Your bag is empty</h2>
          <p className="text-sm text-neutral-400 mb-8">
            Looks like you haven&apos;t added anything yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-neutral-900 text-white text-xs tracking-[0.2em] uppercase font-medium px-8 py-4 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Order success state
  if (orderSuccess) {
    return (
      <div
        id="cart-page"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
      >
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-light mb-2">Order Placed!</h2>
          <p className="text-sm text-neutral-400 mb-2">
            Your order has been placed successfully.
          </p>
          <p className="text-xs text-neutral-300 mb-8">
            Order ID: {orderSuccess}
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-neutral-900 text-white text-xs tracking-[0.2em] uppercase font-medium px-8 py-4 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal >= 2999 ? 0 : 199;
  const total = cartTotal + shipping;

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        size: item.size || "",
      }));

      const res = await createOrder({
        orderItems,
        shippingAddress: {
          address: "Default Address",
          city: "Default City",
          postalCode: "000000",
          country: "India",
        },
      });

      setOrderSuccess(res.data?._id || "confirmed");
      clearCart();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to place order. Please try again.";
      setCheckoutError(msg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div
      id="cart-page"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
    >
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-2">
            Shopping
          </p>
          <h1 className="text-2xl md:text-3xl font-light tracking-wide">
            Your Bag ({cartItems.length})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-neutral-400 underline underline-offset-4 hover:text-neutral-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* ─── Cart Items ─── */}
        <div className="lg:col-span-2 space-y-1">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex gap-4 md:gap-6 py-6 border-b border-neutral-100 animate-fade-in"
            >
              {/* Image */}
              <Link
                to={`/product/${item.productId}`}
                className="w-24 h-32 md:w-28 md:h-36 rounded-lg overflow-hidden bg-neutral-100 shrink-0"
              >
                <img
                  src={item.image || "https://via.placeholder.com/200x250?text=No+Image"}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <Link
                    to={`/product/${item.productId}`}
                    className="text-sm font-medium hover:text-neutral-600 transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-neutral-400 mt-1">
                    Size: {item.size}
                  </p>
                </div>

                <div className="flex items-end justify-between mt-auto">
                  {/* Quantity */}
                  <div className="flex items-center border border-neutral-200 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-700 disabled:opacity-30 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-9 h-9 flex items-center justify-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.size, item.quantity + 1)
                      }
                      className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="text-neutral-300 hover:text-red-500 transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Order Summary ─── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-neutral-50 rounded-xl p-6 md:p-8 space-y-5">
            <h3 className="text-sm tracking-[0.15em] uppercase font-medium">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-neutral-400">
                  Free shipping on orders over ₹2,999
                </p>
              )}
            </div>

            <hr className="border-neutral-200" />

            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium">Total</span>
              <span className="text-xl font-semibold">
                ₹{total.toLocaleString()}
              </span>
            </div>

            {checkoutError && (
              <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">
                {checkoutError}
              </div>
            )}

            {!user && (
              <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                Please sign in to checkout
              </p>
            )}

            <button
              id="checkout-btn"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-neutral-900 text-white text-xs tracking-[0.15em] uppercase font-medium py-4 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : !user ? (
                "Sign In to Checkout"
              ) : (
                "Proceed to Checkout"
              )}
            </button>

            <Link
              to="/products"
              className="block text-center text-xs text-neutral-400 underline underline-offset-4 hover:text-neutral-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
