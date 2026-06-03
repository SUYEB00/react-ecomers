import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
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
  const [logos, setLogos] = useState({});

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

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const snap = await getDoc(doc(db, "Settings", "LogoLinks"));

        if (snap.exists()) {
          setLogos(snap.data());
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchLogos();
  }, []);

  const [loading, setLoading] = useState(false);

  const copyNumber = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      toast.success("Number copied!");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

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

    if (!form.trxId) {
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

        codPayable:
          selectedPayment?.payment_type === "COD" ? totalProductPrice : 0,

        onlinePaid:
          selectedPayment?.payment_type === "COD" ? deliveryCharge : grandTotal,

        trxId: form.trxId,

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
    0,
  );

  const grandTotal = totalProductPrice + deliveryCharge;

  const getPaymentLogo = (type) => {
    const name = type?.toLowerCase();

    if (name.includes("bkash")) return logos.bkash;
    if (name.includes("nagad")) return logos.nagad;
    if (name.includes("rocket")) return logos.rocket;
    if (name.includes("cod")) return logos.cod;

    return null;
  };

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
            <label className="block mb-2 font-semibold">Select Size</label>

            <div className="flex flex-wrap gap-2">
              {productWithSizes.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      size,
                    }))
                  }
                  className={`min-w-[48px] h-12 px-4 rounded-lg border font-medium transition
            ${
              form.size === size
                ? "bg-gray-300 text-white border-gray-400"
                : "bg-white text-black border-gray-300 hover:border-black"
            }`}
                >
                  {size}
                </button>
              ))}
            </div>
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

          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setSelectedPayment(pm)}
                className={`border rounded-xl p-4 transition flex flex-col items-center justify-center gap-2
      ${
        selectedPayment?.id === pm.id
          ? "border-gray-400 bg-gray-300 text-white"
          : "border-gray-300 bg-white text-black"
      }`}
              >
                {getPaymentLogo(pm.payment_type) ? (
                  <img
                    src={getPaymentLogo(pm.payment_type)}
                    alt={pm.payment_type}
                    className="w-10 h-10 object-contain rounded-md"
                  />
                ) : (
                  <HiOutlineCreditCard className="text-3xl" />
                )}

                <span className="text-sm font-semibold">{pm.payment_type}</span>
              </button>
            ))}
          </div>

          {selectedPayment?.payment_type === "COD" ? (
            <div className="mt-3 p-4 rounded-xl bg-yellow-50 border border-yellow-300 text-sm text-yellow-800 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <IoCashOutline className="text-lg" />
                Cash on Delivery
              </div>

              <p>
                First pay the delivery charge of{" "}
                <strong>{deliveryCharge} BDT</strong> to:
              </p>

              <button
                type="button"
                onClick={() => copyNumber("01940686844")}
                className="font-semibold underline text-left hover:opacity-80"
              >
                Nagad / bKash: 01940686844
                <span className="ml-2 text-xs">(Tap to Copy)</span>
              </button>

              <p>
                The remaining product price of{" "}
                <strong>{totalProductPrice} BDT</strong> will be paid to the
                delivery person upon delivery.
              </p>

              <p className="text-xs text-yellow-700">
                After sending the delivery charge, enter the transaction ID
                below.
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

              <button
                type="button"
                onClick={() => copyNumber(selectedPayment?.payment_no)}
                className="font-semibold underline text-left hover:opacity-80"
              >
                {selectedPayment?.payment_type} – {selectedPayment?.payment_no}
                <span className="ml-2 text-xs">(Tap to Copy)</span>
              </button>

              <p className="text-xs text-blue-700">
                After payment, please enter your transaction ID below.
              </p>
            </div>
          )}
        </div>

        <input
          name="trxId"
          value={form.trxId}
          onChange={handleChange}
          placeholder={
            selectedPayment?.payment_type === "COD"
              ? "Delivery Charge Transaction ID"
              : "Transaction ID"
          }
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl"
          required
        />

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
