import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  // PRODUCT STATE
  const [product, setProduct] = useState({
    title: "",
    product_description: "",
    product_picture: "",
    oldprice: "",
    newprice: "",
    category: "",
  });

  // SLIDER STATE
  const [slider, setSlider] = useState({
    slider_img: "",
  });

  // PAYMENT METHOD STATE
  const [payment, setPayment] = useState({
    payment_type: "",
    payment_no: "",
  });

  const [productsList, setProductsList] = useState([]);
  const [sliderList, setSliderList] = useState([]);
  const [paymentList, setPaymentList] = useState([]);

  // INPUT HANDLERS
  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (e) => {
    setSlider({ ...slider, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  // ADD SLIDER
  const handleSliderSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "Sliders"), slider);
      toast.success("Slider Added!");

      setPayment({ slider_img: "" });
      fetchSlider();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add Slider");
    }
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

  // ADD PRODUCT
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "Products"), product);
      toast.success("Product added!");

      setProduct({
        title: "",
        product_description: "",
        product_picture: "",
        oldprice: "",
        newprice: "",
        category: "",
      });

      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add product");
    }
  };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "Products"));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductsList(items);
  };

  // FETCH SLIDER
  const fetchSlider = async () => {
    const querySnapshot = await getDocs(collection(db, "Sliders"));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSliderList(items);
  };

  // FETCH PAYMENT METHODS
  const fetchPaymentMethods = async () => {
    const querySnapshot = await getDocs(collection(db, "PaymentMethods"));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPaymentList(items);
  };

  useEffect(() => {
    fetchProducts();
    fetchSlider();
    fetchPaymentMethods();
  }, []);

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "Products", id));
    toast.success("Product deleted!");
    setProductsList(productsList.filter((item) => item.id !== id));
  };

  // DELETE SLIDER
  const deleteSlider = async (id) => {
    await deleteDoc(doc(db, "Sliders", id));
    toast.success("Slider deleted!");
    setSliderList(sliderList.filter((item) => item.id !== id));
  };

  // DELETE PAYMENT METHOD
  const deletePayment = async (id) => {
    await deleteDoc(doc(db, "PaymentMethods", id));
    toast.success("Payment method deleted!");
    setPaymentList(paymentList.filter((item) => item.id !== id));
  };

  return (
    <div className="w-11/12 mx-auto font-mon mt-10">
      <Toaster position="top-right" />
      {/* Order Management */}
      <h2 className="text-2xl font-bold mb-5">1. Order Management</h2>
      <button
        onClick={() => navigate("/ordermanagement")}
        className="px-4 py-2 bg-red-500 text-white rounded mb-5"
      >
        Order Management
      </button>

      {/* Message Management */}
      <h2 className="text-2xl font-bold mb-5">2. Message Management</h2>
      <button
        onClick={() => navigate("/messagemanagement")}
        className="px-4 py-2 bg-red-500 text-white rounded mb-5"
      >
        Message Management
      </button>

      {/* User Management */}
      <h2 className="text-2xl font-bold mb-5">3. User Management</h2>
      <button
        onClick={() => navigate("/usermanagement")}
        className="px-4 py-2 bg-red-500 text-white rounded mb-5"
      >
        User Management
      </button>

      {/* SLIDER FORM */}
      <h2 className="text-2xl font-bold mb-5">4. Add Slider</h2>

      <form onSubmit={handleSliderSubmit} className="space-y-4">
        <input
          name="slider_img"
          value={slider.slider_img}
          onChange={handleSliderChange}
          placeholder="Slider IMG URL"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded mb-5"
        >
          Add Slider
        </button>
      </form>

      {/* SLIDER LIST */}
      <h2 className="text-xl font-bold mt-5 mb-3">All Sliders</h2>

      {/* TOTAL SLIDER */}
      <div className="mb-5 text-xl font-semibold text-[#21214c]">
        Total Sliders:{" "}
        <span className="text-[#ff8f9c]">{sliderList.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {sliderList.map((item) => (
          <div
            className="border p-4 rounded-xl flex justify-between items-center border-gray-300"
            key={item.id}
          >
            <div>
              <p className="font-bold mb-2">{item.slider_img}</p>

              <button
                onClick={() => deleteSlider(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAYMENT METHOD FORM */}
      <h2 className="text-2xl font-bold mb-5">5. Add Payment Method</h2>

      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        <input
          name="payment_type"
          value={payment.payment_type}
          onChange={handlePaymentChange}
          placeholder="Payment Type (Bkash, Nagad, Rocket)"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        <input
          name="payment_no"
          value={payment.payment_no}
          onChange={handlePaymentChange}
          placeholder="Payment Number"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded mb-5"
        >
          Add Payment Method
        </button>
      </form>

      {/* PAYMENT LIST */}
      <h2 className="text-xl font-bold mt-5 mb-3">Payment Methods</h2>

      {/* TOTAL PAYMENTS METHOD */}
      <div className="mb-5 text-xl font-semibold text-[#21214c]">
        Total Payment Method:{" "}
        <span className="text-[#ff8f9c]">{paymentList.length}</span>
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
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* PRODUCT FORM */}
      <h2 className="text-2xl font-bold mb-5">6. Add Product</h2>

      <form onSubmit={handleProductSubmit} className="space-y-4">
        <input
          name="title"
          value={product.title}
          onChange={handleProductChange}
          placeholder="Title"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        <input
          name="product_description"
          value={product.product_description}
          onChange={handleProductChange}
          placeholder="Product Description"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        <input
          name="product_picture"
          value={product.product_picture}
          onChange={handleProductChange}
          placeholder="Image URL"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        <input
          name="oldprice"
          value={product.oldprice}
          onChange={handleProductChange}
          placeholder="Old Price"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        <input
          name="newprice"
          value={product.newprice}
          onChange={handleProductChange}
          placeholder="New Price"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        <input
          name="category"
          value={product.category}
          onChange={handleProductChange}
          placeholder="Category"
          className="w-full p-3 border border-gray-300 rounded-xl"
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Add Product
        </button>
      </form>

      {/* PRODUCT LIST */}
      <h2 className="text-xl font-bold mt-10 mb-4">All Products</h2>

      {/* TOTAL PRODUCTS */}
      <div className="mb-5 text-xl font-semibold text-[#21214c]">
        Total Products:{" "}
        <span className="text-[#ff8f9c]">{productsList.length}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        {productsList.map((item) => (
          <div className="px-3 border border-gray-300 rounded-xl" key={item.id}>
            <img
              src={item.product_picture}
              alt={item.title}
              className="w-auto h-auto object-cover rounded"
            />

            <h3 className="font-bold mt-2">{item.title}</h3>
            <p>New Price: {item.newprice}</p>
            <p>Old Price: {item.oldprice}</p>
            <p>Category: {item.category}</p>

            <button
              onClick={() => deleteProduct(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded mt-3 mb-3"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddProduct;
