import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [displayItems, setDisplayItems] = useState(cart);

  useEffect(() => {
    if (location.state?.buyNowProduct) {
      setDisplayItems([
        {
          ...location.state.buyNowProduct,
          quantity: 1,
        },
      ]);
    } else {
      setDisplayItems(cart);
    }
  }, [location.state, cart]);

  const subtotal = displayItems.reduce(
    (total, item) => total + Number(item.newprice) * item.quantity,
    0
  );

  if (displayItems.length === 0) {
    return (
      <div className="w-11/12 mx-auto mt-10 text-center font-pop">
        <h1 className="text-3xl font-bold text-[#ff8f9c]">
          Your Cart is Empty
        </h1>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-[#ff8f9c] transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="w-11/12 max-w-3xl mx-auto mt-6 font-pop">
      <h1 className="text-3xl font-bold text-[#ff8f9c] mb-6">Shopping Cart</h1>

      <div className="space-y-4">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 border rounded-xl shadow-sm bg-white"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product_picture}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-md border"
              />

              <div>
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.newprice} BDT</p>
                <p className="text-sm text-black">Qty: {item.quantity}</p>
              </div>
            </div>

            {!location.state?.buyNowProduct && (
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-xl hover:text-red-700"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border rounded-xl bg-white shadow">
        <div className="flex justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>{subtotal} BDT</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="mt-4 w-full bg-black text-white py-3 rounded-xl hover:bg-[#ff8f9c] transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
