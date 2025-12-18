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

const AddPaymentNumber = () => {
  // PAYMENT METHOD STATE
  const [payment, setPayment] = useState({
    payment_type: "",
    payment_no: "",
  });

  const [paymentList, setPaymentList] = useState([]);

  // DELIVERY CHARGE STATE
  const [deliveryCharge, setDeliveryCharge] = useState("");

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleDeliveryChargeChange = (e) => {
    setDeliveryCharge(e.target.value);
  };

  // ADD PAYMENT METHOD
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

  // SAVE DELIVERY CHARGE
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

  // FETCH PAYMENT METHODS
  const fetchPaymentMethods = async () => {
    const querySnapshot = await getDocs(collection(db, "PaymentMethods"));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPaymentList(items);

    // fetch delivery charge
    const deliveryDoc = await getDoc(doc(db, "Settings", "DeliveryCharge"));
    if (deliveryDoc.exists()) {
      setDeliveryCharge(deliveryDoc.data().charge);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // DELETE PAYMENT METHOD
  const deletePayment = async (id) => {
    await deleteDoc(doc(db, "PaymentMethods", id));
    toast.success("Payment method deleted!");
    setPaymentList(paymentList.filter((item) => item.id !== id));
  };

  return (
    <div className="w-11/12 mx-auto font-mon mt-10">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold mb-5">Add Payment Method</h2>

      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        <input
          name="payment_type"
          value={payment.payment_type}
          onChange={handlePaymentChange}
          placeholder="Payment Type (Bkash, Nagad, Rocket)"
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          required
        />

        <input
          name="payment_no"
          value={payment.payment_no}
          onChange={handlePaymentChange}
          placeholder="Payment Number"
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-[#000000] text-white rounded mb-5"
        >
          Add Payment Method
        </button>
      </form>

      {/* PAYMENT LIST */}
      <h2 className="text-xl font-bold mt-5 mb-3">Payment Methods</h2>

      <div className="mb-5 text-xl font-semibold text-[#21214c]">
        Total Payment Method:{" "}
        <span className="text-red-500">{paymentList.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {paymentList.map((item) => (
          <div
            className="border p-4 rounded-xl flex justify-between items-center border-gray-300"
            key={item.id}
          >
            <div>
              <p className="font-bold">{item.payment_type}</p>
              <p>{item.payment_no}</p>
            </div>

            <button
              onClick={() => deletePayment(item.id)}
              className="bg-[#000000] text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* DELIVERY CHARGE */}
      <h2 className="text-2xl font-bold mt-10 mb-5">Delivery Charge</h2>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="number"
          min="0"
          value={deliveryCharge}
          onChange={handleDeliveryChargeChange}
          placeholder="Delivery Charge (BDT)"
          className="w-full sm:w-auto p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
        />
        <button
          onClick={saveDeliveryCharge}
          className="px-4 py-2 bg-[#000000] text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddPaymentNumber;
