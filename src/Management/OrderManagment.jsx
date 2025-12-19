import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineCash,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineMail,
  HiOutlineShoppingBag,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineXCircle,
} from "react-icons/hi";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

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
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold text-center text-black mb-2">
        Order Management
      </h1>

      <p className="text-center text-gray-500 mb-6">
        Manage, track and update customer orders
      </p>

      <div className="mb-5 text-lg font-semibold text-gray-700">
        Total Orders:{" "}
        <span className="ml-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">{orders.length}</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Products</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Amounts</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50 transition align-top"
              >
                {/* PRODUCTS */}
                <td className="p-3">
                  {(order.items || []).map((item, index) => (
                    <div key={index} className="flex items-start gap-2 mb-1">
                      <HiOutlineShoppingBag className="mt-1 text-gray-500" />
                      <span>
                        {item.title}{" "}
                        <span className="text-xs text-gray-500">
                          ({item.size || "N/A"})
                        </span>{" "}
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                </td>

                {/* CUSTOMER */}
                <td className="p-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <HiOutlineUser />
                    {order.name}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{order.address}</p>
                  {order.note && (
                    <p className="text-xs text-gray-500 mt-1">
                      Note: {order.note}
                    </p>
                  )}
                </td>

                {/* CONTACT */}
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <HiOutlineMail />
                    {order.email}
                  </div>
                </td>

                {/* PAYMENT */}
                <td className="p-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <HiOutlineCash />
                    {order.payment_type}
                  </div>
                  <p className="text-xs text-gray-600">{order.payment_no}</p>
                  {order.trxId && (
                    <p className="text-xs text-blue-600 mt-1">
                      TRX: {order.trxId}
                    </p>
                  )}
                </td>

                {/* AMOUNTS */}
                <td className="p-3">
                  <p>Products: {order.productTotal}৳</p>
                  <p>Delivery: {order.deliveryCharge}৳</p>
                  <p className="font-bold mt-1">Total: {order.totalPrice}৳</p>

                  {order.codPayable > 0 && (
                    <p className="text-xs text-orange-600 mt-1">
                      COD Due: {order.codPayable}৳
                    </p>
                  )}

                  {order.onlinePaid > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Paid Online: {order.onlinePaid}৳
                    </p>
                  )}
                </td>

                {/* STATUS */}
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "out of stock"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-3">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => updateStatus(order.id, "completed")}
                      className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs"
                    >
                      <HiOutlineCheckCircle />
                      Complete
                    </button>

                    <button
                      onClick={() => updateStatus(order.id, "pending")}
                      className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded text-xs"
                    >
                      <HiOutlineClock />
                      Pending
                    </button>

                    <button
                      onClick={() => updateStatus(order.id, "out of stock")}
                      className="flex items-center gap-1 px-2 py-1 bg-orange-600 text-white rounded text-xs"
                    >
                      Out
                    </button>

                    <button
                      onClick={() => updateStatus(order.id, "rejected")}
                      className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded text-xs"
                    >
                      <HiOutlineXCircle />
                      Reject
                    </button>

                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="flex items-center gap-1 px-2 py-1 bg-black text-white rounded text-xs"
                    >
                      <HiOutlineTrash />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
