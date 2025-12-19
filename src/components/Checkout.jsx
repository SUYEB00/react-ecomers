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
import {
  HiOutlineCreditCard,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from "react-icons/hi";
import { MdOutlineStickyNote2 } from "react-icons/md";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const { cart, clearCart, buyNowItem, clearBuyNow } = useCart();
  const itemsToShow = buyNowItem ? [buyNowItem] : cart;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/login");
    });
    return unsubscribe;
  }, [navigate]);

  const productWithSizes = itemsToShow.find((item) => item?.sizes?.length > 0);

  const [form, setForm] = useState({
    name: "",
    phone: "",
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
    const fetchDeliveryCharge = async () => {
      const snap = await getDocs(collection(db, "Settings"));
      snap.forEach((doc) => {
        if (doc.id === "DeliveryCharge") {
          setDeliveryCharge(Number(doc.data().charge));
        }
      });
    };
    fetchDeliveryCharge();
  }, []);

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
    if (!form.name || !form.address) {
      return toast.error("Please fill all required fields");
    }

    if (!/^01[3-9]\d{8}$/.test(form.phone)) {
      return toast.error("Enter a valid phone number");
    }

    if (productWithSizes && !form.size) {
      return toast.error("Please select a size");
    }

    if (selectedPayment?.payment_type !== "COD" && !form.trxId) {
      return toast.error("Transaction ID is required");
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "Orders"), {
        userEmail: auth.currentUser.email,
        items: itemsToShow.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.newprice,
          quantity: item.quantity,
          size: form.size || null,
        })),

        productTotal: totalProductPrice,
        deliveryCharge,
        totalPrice: grandTotal,

        codPayable: selectedPayment?.payment_type === "COD" ? grandTotal : 0,

        onlinePaid: selectedPayment?.payment_type === "COD" ? 0 : grandTotal,

        trxId: selectedPayment?.payment_type === "COD" ? "COD" : form.trxId,

        payment_type: selectedPayment.payment_type,
        payment_no: selectedPayment.payment_no,

        name: form.name,
        phone: form.phone,
        address: form.address,

        note: form.note,

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

  const totalProductPrice = itemsToShow.reduce(
    (total, item) => total + item.quantity * Number(item.newprice),
    0
  );

  const grandTotal = totalProductPrice + deliveryCharge;

  return (
    <div className="w-11/12 mx-auto mt-6 max-w-xl font-pop">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold text-center mb-2 text-black flex justify-center items-center gap-2">
        <HiOutlineShoppingCart className="text-3xl" />
        Checkout
      </h2>

      <p className="text-center text-sm text-gray-500 mb-6">
        Review your order and confirm payment
      </p>

      {/* Order Summary */}
      <div className="w-full mb-4 p-4 border border-gray-300 rounded-xl space-y-4 bg-white">
        {itemsToShow.map((item) => (
          <div key={item.id} className="border-b last:border-b-0 pb-3">
            <div className="flex items-center gap-4">
              <img
                src={item.product_picture}
                alt={item.title}
                className="w-20 h-20 rounded-xl border object-cover"
              />

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-black font-bold">{item.newprice} BDT</p>

                <div className="flex gap-3 text-sm text-gray-600 mt-1">
                  <span>Qty: {item.quantity}</span>
                  {item.size && (
                    <span className="px-2 py-0.5 bg-gray-100 rounded-md text-xs">
                      Size: {item.size}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="flex justify-between text-lg">
            <span>Product Total</span>
            <span>{totalProductPrice} BDT</span>
          </p>

          <p className="flex justify-between text-lg mt-2">
            <span>Delivery Charge</span>
            <span>{deliveryCharge} BDT</span>
          </p>

          <hr className="my-3" />

          <p className="flex justify-between text-xl font-bold">
            <span>Total Payable</span>
            <span>{grandTotal} BDT</span>
          </p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl p-3">
          <HiOutlineUser className="text-xl text-gray-500" />
          <input
            name="name"
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full bg-transparent outline-none"
          />
        </div>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl p-3">
          <HiOutlinePhone className="text-xl text-gray-500" />
          <input
            type="tel"
            name="phone"
            onChange={handleChange}
            placeholder="Your Phone Number"
            className="w-full bg-transparent outline-none"
            required
          />
        </div>

        <div className="flex items-start gap-2 bg-gray-50 border border-gray-300 rounded-xl p-3">
          <HiOutlineLocationMarker className="text-xl text-gray-500 mt-1" />
          <textarea
            name="address"
            onChange={handleChange}
            placeholder="Full Address"
            className="w-full bg-transparent outline-none resize-none"
          />
        </div>

        {productWithSizes && (
          <div>
            <label className="block mb-1 font-semibold">Select Size</label>
            <select
              name="size"
              value={form.size}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl"
              required
            >
              <option value="">Choose size</option>
              {productWithSizes.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-start gap-2 bg-gray-50 border border-gray-300 rounded-xl p-3">
          <MdOutlineStickyNote2 className="text-xl text-gray-500 mt-1" />
          <textarea
            name="note"
            onChange={handleChange}
            placeholder="Order note (optional)"
            className="w-full bg-transparent outline-none resize-none"
          />
        </div>

        {/* Payment Method */}
        <div className="w-full p-4 border border-gray-300 rounded-xl">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <HiOutlineCreditCard className="text-xl" />
            Payment Method
          </h3>

          {paymentMethods.map((pm) => (
            <label
              key={pm.id}
              className={`flex items-center gap-3 p-4 mb-2 border rounded-xl cursor-pointer transition
          ${
            selectedPayment?.id === pm.id
              ? "border-black bg-gray-50"
              : "bg-white"
          }`}
            >
              <input
                type="radio"
                checked={selectedPayment?.id === pm.id}
                onChange={() => setSelectedPayment(pm)}
              />

              <div className="flex items-center gap-2">
                {pm.payment_type === "COD" ? (
                  <IoCashOutline className="text-xl" />
                ) : (
                  <HiOutlineCreditCard className="text-xl" />
                )}
                <div>
                  <p className="font-semibold">{pm.payment_type}</p>
                  <p className="text-sm text-gray-600">{pm.payment_no}</p>
                </div>
              </div>
            </label>
          ))}

          {selectedPayment?.payment_type === "COD" ? (
            <div className="mt-3 p-4 rounded-xl bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <IoCashOutline className="text-lg" />
                Cash on Delivery
              </div>

              <p>
                Pay <strong>{grandTotal} BDT</strong> directly to the delivery
                person at the time of delivery.
              </p>

              <p className="text-xs text-yellow-700">
                No online payment is required. Please keep the full amount ready
                in cash.
              </p>
            </div>
          ) : (
            <div className="mt-3 p-4 rounded-xl bg-blue-50 border border-blue-300 text-sm text-blue-800 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <HiOutlineCreditCard className="text-lg" />
                Online Payment
              </div>

              <p>
                Pay <strong>{grandTotal} BDT</strong> to:
              </p>

              <p className="font-semibold">
                {selectedPayment?.payment_type} – {selectedPayment?.payment_no}
              </p>

              <p className="text-xs text-blue-700">
                After payment, please enter your transaction ID below.
              </p>
            </div>
          )}
        </div>

        {selectedPayment?.payment_type !== "COD" && (
          <input
            name="trxId"
            onChange={handleChange}
            placeholder="Transaction ID"
            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
            required
          />
        )}

        <button
          onClick={handleOrder}
          disabled={loading}
          className="bg-black hover:bg-gray-900 text-white text-lg px-4 py-3 w-full rounded-xl shadow-md transition mb-5"
        >
          {loading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
