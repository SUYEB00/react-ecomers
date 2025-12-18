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

const AddProducts = () => {
  // PRODUCT STATE
  const [product, setProduct] = useState({
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

  const [productsList, setProductsList] = useState([]);
  const [editId, setEditId] = useState(null);

  // INPUT HANDLER
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

  // ADD / UPDATE PRODUCT
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

  // FETCH PRODUCTS
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

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await deleteDoc(doc(db, "Products", id));
    toast.success("Product deleted!");
    setProductsList(productsList.filter((item) => item.id !== id));
  };

  // EDIT PRODUCT
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
    <div className="w-11/12 mx-auto mt-10 font-mon">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold mb-6">
        {editId ? "Edit Product" : "Add Product"}
      </h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={product.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-3  bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          required
        />

        <input
          name="product_description"
          value={product.product_description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3  bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          required
        />

        <input
          name="product_picture"
          value={product.product_picture}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-3  bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          required
        />

        <input
          name="oldprice"
          value={product.oldprice}
          onChange={handleChange}
          placeholder="Old Price"
          className="w-full p-3  bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          required
        />

        <input
          name="newprice"
          value={product.newprice}
          onChange={handleChange}
          placeholder="New Price"
          className="w-full p-3  bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          required
        />

        <input
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-3  bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          required
        />

        <input
          name="sizes"
          value={product.sizes.join(", ")}
          onChange={handleChange}
          placeholder="Sizes (S,M,L,XL)"
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
        />

        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          placeholder="Stock Quantity"
          className="w-full p-3  bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            checked={product.inStock}
            onChange={handleChange}
          />
          In Stock
        </label>

        <button
          type="submit"
          className="px-6 py-2 bg-black text-white rounded-xl"
        >
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* PRODUCT LIST */}
      <h2 className="text-xl font-bold mt-12 mb-4">All Products</h2>

      <div className="mb-5 text-lg font-semibold">
        Total Products:{" "}
        <span className="text-red-500">{productsList.length}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 bg-[#ffffff] rounded-2xl">
        {productsList.map((item) => (
          <div key={item.id} className=" p-3">
            <img
              src={item.product_picture}
              alt={item.title}
              className="h-[100px] w-[100px] mx-auto rounded object-cover sm:h-[160px] sm:w-[160px]"
            />

            <h3 className="font-bold mt-2">{item.title}</h3>
            <p>৳ {item.newprice}</p>
            <p className="line-through text-sm">৳ {item.oldprice}</p>
            <p>Stock: {item.stock}</p>
            <p>Status: {item.inStock ? "Available" : "Out of Stock"}</p>
            <p>Sizes: {item.sizes?.join(", ")}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => editProduct(item)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProduct(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
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
