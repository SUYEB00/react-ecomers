import { useLocation } from "react-router-dom";
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

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) navigate("/login");
    });
    return unsubscribe;
  }, [navigate]);

  const [quantity, setQuantity] = useState(1);
  const DELIVERY_CHARGE = 80;

  const totalProductPrice = quantity * Number(product?.newprice || 0);
  const subTotal = totalProductPrice + DELIVERY_CHARGE;

  const decreaseQty = () => quantity > 1 && setQuantity(quantity - 1);
  const increaseQty = () => setQuantity(quantity + 1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    trxId: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ------------------------------
  // Fetch ALL payment methods
  // ------------------------------
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      const snap = await getDocs(collection(db, "PaymentMethods"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPaymentMethods(list);
      if (list.length > 0) setSelectedPayment(list[0]); // Auto-select first
    };

    fetchPayments();
  }, []);

  // ------------------------------
  // ORDER HANDLER
  // ------------------------------
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (!form.name || !form.email || !form.address || !form.trxId)
      return toast.error("Please fill all fields");

    if (!selectedPayment) return toast.error("Please select a payment method");

    setLoading(true);

    try {
      await addDoc(collection(db, "Orders"), {
        userEmail: auth.currentUser.email,
        productId: product.id,
        productTitle: product.title,
        price: product.newprice,
        quantity,
        totalPrice: subTotal,
        name: form.name,
        email: form.email,
        address: form.address,
        trxId: form.trxId,

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
      setTimeout(() => navigate("/orders"), 2000);
    } catch (error) {
      console.log(error);
      toast.error("Order failed!");
    }

    setLoading(false);
  };

  if (!product) {
    return (
      <h2 className="text-4xl font-bold text-center text-[#ff8f9c] mt-10">
        No product selected
      </h2>
    );
  }

  return (
    <div className="w-11/12 mx-auto mt-6 max-w-xl font-pop">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-bold text-center mb-6 text-[#ff8f9c]">
        Checkout
      </h2>

      {/* PRODUCT SECTION */}
      <div className="w-full mb-4 p-3 border border-gray-300 rounded-xl">
        <img
          src={product.product_picture}
          alt={product.title}
          className="w-40 mx-auto rounded-lg"
        />

        <h3 className="text-xl text-center mt-3">{product.title}</h3>

        <p className="text-center text-lg font-semibold text-black">
          {product.newprice} BDT
        </p>

        <div className="w-25 flex items-center justify-center gap-4 mt-4 border border-gray-300">
          <button onClick={decreaseQty} className="px-2 text-xl">
            -
          </button>
          <span className="text-2xl">{quantity}</span>
          <button onClick={increaseQty} className="px-2 text-xl">
            +
          </button>
        </div>

        <div className="mt-5 w-full mb-4 p-3 border border-gray-300 rounded-xl">
          <p className="flex justify-between text-lg">
            <span>Product Total</span>
            <span>{totalProductPrice} BDT</span>
          </p>
          <p className="flex justify-between text-lg mt-2">
            <span>Delivery Charge</span>
            <span>{DELIVERY_CHARGE} BDT</span>
          </p>
          <hr className="my-3" />
          <p className="flex justify-between text-xl font-bold text-black">
            <span>Subtotal</span>
            <span>{subTotal} BDT</span>
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {/* USER INFO */}
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

        {/* PAYMENT METHODS */}
        <div className="w-full mb-4 p-3 border border-gray-300 rounded-xl">
          <h3 className="text-lg font-bold mb-2">Select Payment Method</h3>

          {paymentMethods.length === 0 ? (
            <p className="text-sm text-red-500">No payment methods found!</p>
          ) : (
            paymentMethods.map((pm) => (
              <label
                key={pm.id}
                className="flex items-center gap-3 border p-2 mb-2 rounded-lg cursor-pointer"
              >
                <input
                  type="radio"
                  checked={selectedPayment?.id === pm.id}
                  onChange={() => setSelectedPayment(pm)}
                />
                <div>
                  <p className="font-semibold">{pm.payment_type}</p>
                  <p className="text-sm">{pm.payment_no}</p>
                </div>
              </label>
            ))
          )}

          {selectedPayment && (
            <p className="text-sm mt-2">
              Send payment to <strong>{selectedPayment.payment_no} </strong>
              and enter the transaction ID below.
            </p>
          )}
        </div>

        {/* TRX ID */}
        <input
          name="trxId"
          onChange={handleChange}
          placeholder="Transaction ID"
          className="w-full mb-4 p-3 border rounded-xl"
        />

        {/* CONFIRM BUTTON */}
        <button
          onClick={handleOrder}
          disabled={loading}
          className="bg-black text-white text-lg px-4 py-3 w-full rounded-lg shadow mb-5 hover:bg-[#ff8f9c] transition"
        >
          {loading ? "Confirming..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
