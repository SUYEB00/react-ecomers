import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const q = query(
          collection(db, "Orders"),
          where("userEmail", "==", user.email)
        );

        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load orders");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="w-11/12 mx-auto mt-35 max-w-3xl font-pop">
      <h2 className="text-3xl font-bold text-center mb-6 text-[#ff8f9c]">
        Your Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-4xl font-bold text-center text-[#ff8f9c] mt-10">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded-xl shadow-sm bg-white"
            >
              {/* Order ID */}
              <p className="font-semibold text-lg text-[#21214c]">
                Order ID: {order.id}
              </p>

              {/* ITEMS LIST */}
              <div className="border-t mt-3 pt-3 space-y-2">
                {order.items?.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span>
                      {product.title} (x{product.quantity})
                    </span>

                    <span>
                      {Number(product.newprice || product.price) *
                        product.quantity}{" "}
                      BDT
                    </span>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="flex justify-between mt-4 text-lg font-semibold">
                <span>Total Price:</span>
                <span>{order.totalPrice} BDT</span>
              </div>

              {/* STATUS */}
              <div className="flex justify-between mt-1">
                <span>Status:</span>
                <span className="font-semibold text-[#ff8f9c]">
                  {order.status}
                </span>
              </div>

              {/* ORDER DATE */}
              {order.date && (
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(order.date.seconds * 1000).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
