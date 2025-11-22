import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch orders from Firestore
  const fetchOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Orders"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "Orders", orderId), { status: newStatus });
      toast.success("Order status updated!");
      fetchOrders();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status.");
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "Orders", orderId));
      toast.success("Order deleted!");
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete order.");
    }
  };

  return (
    <div className="w-11/12 mx-auto mt-10 font-pop">
      <h1 className="text-3xl font-bold text-center text-[#ff8f9c] mb-6">
        Order Management
      </h1>

      {/* TOTAL ORDERS */}
      <div className="mb-5 text-xl font-semibold text-[#21214c]">
        Total Orders: <span className="text-[#ff8f9c]">{orders.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-xl">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Total Price</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center">
                <td className="p-2 border">{order.productTitle}</td>
                <td className="p-2 border">{order.name}</td>
                <td className="p-2 border">{order.email}</td>
                <td className="p-2 border">{order.quantity}</td>
                <td className="p-2 border">{order.totalPrice} BDT</td>
                <td className="p-2 border">{order.status}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    onClick={() => updateStatus(order.id, "completed")}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, "out of stock")}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Out Of Stock
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, "pending")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateStatus(order.id, "rejected")}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Rejected
                  </button>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
