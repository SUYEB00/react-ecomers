import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineCheckCircle,
  HiOutlineCube,
  HiOutlinePencil,
  HiOutlineTag,
  HiOutlineTrash,
  HiOutlineXCircle,
} from "react-icons/hi";

const AddProducts = () => {
  const [product, setProduct] = useState({
    title: "",
    product_description: "",
    product_picture: "",
    oldprice: "",
    newprice: "",
    category: "",
    sizes: [],
    stock: 0,
    sold: 0,
    inStock: true,
  });

  const [productsList, setProductsList] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "sizes") {
      setProduct({
        ...product,
        sizes: value.split(",").map((s) => s.trim()),
      });
    } else if (type === "checkbox") {
      setProduct({ ...product, [name]: checked });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await updateDoc(doc(db, "Products", editId), product);
        toast.success("Product updated!");
        setEditId(null);
      } else {
        await addDoc(collection(db, "Products"), {
          ...product,
          createdAt: new Date().toISOString(),
        });
        toast.success("Product added!");
      }

      setProduct({
        title: "",
        product_description: "",
        product_picture: "",
        oldprice: "",
        newprice: "",
        category: "",
        sizes: [],
        stock: 0,
        inStock: true,
      });

      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "Products"));
    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductsList(items);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "Products", id));
      toast.success("Product deleted!");
      setProductsList(productsList.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  const editProduct = (item) => {
    setEditId(item.id);
    setProduct({
      title: item.title,
      product_description: item.product_description,
      product_picture: item.product_picture,
      oldprice: item.oldprice,
      newprice: item.newprice,
      category: item.category,
      sizes: item.sizes || [],
      stock: item.stock || 0,
      inStock: item.inStock ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-11/12 mx-auto mt-10 mb-10 font-mon">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <HiOutlineCube className="text-gray-600" />
          {editId ? "Edit Product" : "Add Product"}
        </h2>

        <div className="text-lg font-semibold">
          Total Products:
          <span className="ml-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
            {productsList.length}
          </span>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 mb-12">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="title"
            value={product.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none"
            required
          />

          <input
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Category"
            className="p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none"
            required
          />

          <input
            name="product_picture"
            value={product.product_picture}
            onChange={handleChange}
            placeholder="Image URL"
            className="p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none md:col-span-2"
            required
          />

          <input
            name="product_description"
            value={product.product_description}
            onChange={handleChange}
            placeholder="Short Description"
            className="p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none md:col-span-2"
            required
          />

          <input
            name="oldprice"
            value={product.oldprice}
            onChange={handleChange}
            placeholder="Old Price"
            className="p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none"
            required
          />

          <input
            name="newprice"
            value={product.newprice}
            onChange={handleChange}
            placeholder="New Price"
            className="p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none"
            required
          />

          <input
            name="sizes"
            value={product.sizes.join(", ")}
            onChange={handleChange}
            placeholder="Sizes (S, M, L, XL)"
            className="p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none"
          />

          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            placeholder="Stock Quantity"
            className="p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none"
            required
          />

          {/* STOCK STATUS */}
          <div className="flex items-center gap-3 md:col-span-2">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                name="inStock"
                checked={product.inStock}
                onChange={handleChange}
              />
              In Stock
            </label>
          </div>

          <button
            type="submit"
            className="md:col-span-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
          >
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* PRODUCT GRID */}
      <h2 className="text-2xl font-bold mb-4">All Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {productsList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition p-4"
          >
            <img
              src={item.product_picture}
              alt={item.title}
              className="h-40 w-full object-cover rounded-xl mb-3"
            />

            <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>

            <p className="text-sm text-gray-500 flex items-center gap-1">
              <HiOutlineTag /> {item.category}
            </p>

            <div className="mt-2">
              <p className="font-semibold text-black">৳ {item.newprice}</p>
              <p className="text-sm line-through text-gray-400">
                ৳ {item.oldprice}
              </p>
            </div>

            <p className="text-sm mt-1">
              Stock: <span className="font-semibold">{item.stock}</span>
            </p>

            <p className="text-sm flex items-center gap-1 mt-1">
              {item.inStock ? (
                <>
                  <HiOutlineCheckCircle className="text-green-600" />
                  Available
                </>
              ) : (
                <>
                  <HiOutlineXCircle className="text-red-600" />
                  Out of Stock
                </>
              )}
            </p>

            <p className="text-sm text-gray-600 mt-1">
              Sizes: {item.sizes?.join(", ")}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => editProduct(item)}
                className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded-xl text-sm hover:bg-blue-700 transition"
              >
                <HiOutlinePencil />
                Edit
              </button>

              <button
                onClick={() => deleteProduct(item.id)}
                className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white py-2 rounded-xl text-sm hover:bg-red-700 transition"
              >
                <HiOutlineTrash />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddProducts;
