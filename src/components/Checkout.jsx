import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import Swal from "sweetalert2";
import { IoCashOutline } from "react-icons/io5";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart, clearCart, buyNowItem, clearBuyNow } = useCart();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/login");
    });
    return unsubscribe;
  }, [navigate]);

  const DELIVERY_CHARGE = 80;

  const itemsToShow = buyNowItem ? [buyNowItem] : cart; // IMPORTANT

  const totalProductPrice = itemsToShow.reduce(
    (total, item) => total + item.quantity * Number(item.newprice),
    0
  );

  const subTotal = totalProductPrice + DELIVERY_CHARGE;

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    trxId: "",
    size: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      const snap = await getDocs(collection(db, "PaymentMethods"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPaymentMethods(list);
      if (list.length > 0) setSelectedPayment(list[0]);
    };

    fetchPayments();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (!form.name || !form.email || !form.address || !form.trxId)
      return toast.error("Please fill all required fields");

    if (!form.size) return toast.error("Please select a size");

    if (!selectedPayment) return toast.error("Please select a payment method");

    setLoading(true);

    try {
      await addDoc(collection(db, "Orders"), {
        userEmail: auth.currentUser.email,
        items: itemsToShow.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.newprice,
          quantity: item.quantity,
        })),
        deliveryCharge: DELIVERY_CHARGE,
        totalPrice: subTotal,
        name: form.name,
        email: form.email,
        address: form.address,
        trxId: form.trxId,

        size: form.size, // ✅ NEW
        note: form.note, // ✅ NEW

        payment_type: selectedPayment.payment_type,
        payment_no: selectedPayment.payment_no,
        status: "pending",
        date: serverTimestamp(),
      });

      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Order Confirmed!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Clear correct data
      if (buyNowItem) clearBuyNow();
      else clearCart();

      setTimeout(() => navigate("/orders"), 2000);
    } catch (error) {
      console.log(error);
      toast.error("Order failed!");
    }

    setLoading(false);
  };

  if (itemsToShow.length === 0)
    return (
      <h2 className="text-4xl font-bold text-center text-[#000000] mt-10">
        Your cart is empty
      </h2>
    );

  return (
    <div className="w-11/12 mx-auto mt-6 max-w-xl font-pop">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold text-center mb-6 text-[#000000]">
        Checkout
      </h2>

      <div className="w-full mb-4 p-3 border border-gray-300 rounded-xl space-y-3">
        {itemsToShow.map((item) => (
          <div key={item.id} className="border-b pb-3">
            <div className="flex items-center gap-3">
              <img
                src={item.product_picture}
                alt={item.title}
                className="w-20 h-20 rounded-lg border"
              />

              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-black font-bold">{item.newprice} BDT</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-5">
          <p className="flex justify-between text-lg">
            <span>Product Total</span>
            <span>{totalProductPrice} BDT</span>
          </p>

          <p className="flex justify-between text-lg mt-2">
            <span>Delivery Charge</span>
            <span>{DELIVERY_CHARGE} BDT</span>
          </p>

          <hr className="my-3" />

          <p className="flex justify-between text-xl font-bold">
            <span>Subtotal</span>
            <span>{subTotal} BDT</span>
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <input
          name="name"
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full mb-4 p-3 border rounded-xl"
        />

        <input
          name="email"
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full mb-4 p-3 border rounded-xl"
        />

        <textarea
          name="address"
          onChange={handleChange}
          placeholder="Full Address"
          className="w-full mb-4 p-3 border rounded-xl"
        ></textarea>

        {/* Size Selection */}
        <div className="w-full mb-4">
          <label className="block mb-1 font-semibold">Select Size</label>
          <select
            name="size"
            value={form.size}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          >
            <option value="">Choose size</option>
            <option value="S">Small (S)</option>
            <option value="M">Medium (M)</option>
            <option value="L">Large (L)</option>
            <option value="XL">Extra Large (XL)</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {/* Order Note */}
        <textarea
          name="note"
          onChange={handleChange}
          placeholder="Order note (color, size details, delivery instructions etc.)"
          className="w-full mb-4 p-3 border rounded-xl"
        />

        <div className="w-full mb-4 p-3 border border-gray-300 rounded-xl">
          <h3 className="text-lg font-bold mb-2">Select Payment Method</h3>

          {paymentMethods.map((pm) => (
            <label
              key={pm.id}
              className={`flex items-center gap-3 p-3 mb-2 border rounded-xl cursor-pointer transition ${
                selectedPayment?.id === pm.id
                  ? "border-[#000000] bg-white"
                  : "bg-white"
              }`}
            >
              <input
                type="radio"
                checked={selectedPayment?.id === pm.id}
                onChange={() => setSelectedPayment(pm)}
              />
              <div className="flex items-center gap-3">
                <IoCashOutline className="text-xl mb-1" />
                <div>
                  <p className="font-semibold">{pm.payment_type}</p>
                  <p className="text-sm text-gray-600">{pm.payment_no}</p>
                </div>
              </div>
            </label>
          ))}
        </div>

        <input
          name="trxId"
          onChange={handleChange}
          placeholder="Transaction ID"
          className="w-full mb-4 p-3 border rounded-xl"
        />

        <button
          onClick={handleOrder}
          disabled={loading}
          className="bg-black text-white text-lg px-4 py-3 w-full rounded-lg shadow mb-5"
        >
          {loading ? "Confirming..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
