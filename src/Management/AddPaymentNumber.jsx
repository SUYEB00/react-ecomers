import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import { FiPlus, FiSave } from "react-icons/fi";
import {
  HiOutlineCash,
  HiOutlineCreditCard,
  HiOutlineTrash,
} from "react-icons/hi";

const AddPaymentNumber = () => {
  const [payment, setPayment] = useState({
    payment_type: "",
    payment_no: "",
  });

  const [paymentList, setPaymentList] = useState([]);

  const [deliveryCharge, setDeliveryCharge] = useState("");

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleDeliveryChargeChange = (e) => {
    setDeliveryCharge(e.target.value);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "PaymentMethods"), payment);
      toast.success("Payment Method Added!");
      setPayment({ payment_type: "", payment_no: "" });
      fetchPaymentMethods();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add payment method");
    }
  };

  const saveDeliveryCharge = async () => {
    try {
      await setDoc(doc(db, "Settings", "DeliveryCharge"), {
        charge: Number(deliveryCharge),
      });
      toast.success("Delivery Charge Updated!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update delivery charge");
    }
  };

  const fetchPaymentMethods = async () => {
    const querySnapshot = await getDocs(collection(db, "PaymentMethods"));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPaymentList(items);

    const deliveryDoc = await getDoc(doc(db, "Settings", "DeliveryCharge"));
    if (deliveryDoc.exists()) {
      setDeliveryCharge(deliveryDoc.data().charge);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const deletePayment = async (id) => {
    await deleteDoc(doc(db, "PaymentMethods", id));
    toast.success("Payment method deleted!");
    setPaymentList(paymentList.filter((item) => item.id !== id));
  };

  return (
    <div className="w-11/12 mx-auto font-mon mt-10">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-black">
          <HiOutlineCreditCard className="text-gray-600" />
          Payment Settings
        </h2>

        <div className="text-lg font-semibold text-gray-700">
          Total Methods:
          <span className="ml-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
            {paymentList.length}
          </span>
        </div>
      </div>

      {/* ADD PAYMENT METHOD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiPlus />
          Add Payment Method
        </h3>

        <form
          onSubmit={handlePaymentSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="payment_type"
            value={payment.payment_type}
            onChange={handlePaymentChange}
            placeholder="Payment Type (Bkash, Nagad, Rocket)"
            className="p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none"
            required
          />

          <input
            name="payment_no"
            value={payment.payment_no}
            onChange={handlePaymentChange}
            placeholder="Payment Number"
            className="p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none"
            required
          />

          <button
            type="submit"
            className="md:col-span-2 px-6 py-3 bg-black text-white rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition"
          >
            <FiPlus />
            Add Payment Method
          </button>
        </form>
      </div>

      {/* PAYMENT METHODS LIST */}
      <h3 className="text-2xl font-bold mb-4">Payment Methods</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {paymentList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition p-5 flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <HiOutlineCash className="text-2xl text-gray-500" />
              <div>
                <p className="font-semibold text-gray-900">
                  {item.payment_type}
                </p>
                <p className="text-sm text-gray-600">{item.payment_no}</p>
              </div>
            </div>

            <button
              onClick={() => deletePayment(item.id)}
              className="p-2 bg-black text-white rounded-xl hover:bg-red-600 transition"
              title="Delete"
            >
              <HiOutlineTrash />
            </button>
          </div>
        ))}

        {paymentList.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No payment methods added yet.
          </p>
        )}
      </div>

      {/* DELIVERY CHARGE */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 mb-10">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <HiOutlineCreditCard />
          Delivery Charge
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="number"
            min="0"
            value={deliveryCharge}
            onChange={handleDeliveryChargeChange}
            placeholder="Delivery Charge (BDT)"
            className="w-full sm:w-64 p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none"
          />

          <button
            onClick={saveDeliveryCharge}
            className="px-6 py-3 bg-black text-white rounded-xl flex items-center gap-2 hover:bg-gray-800 transition"
          >
            <FiSave />
            Save Charge
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentNumber;
