import React, { useEffect, useState } from "react";
import CatagoriesNav from "./CatagoriesNav";
import toast from "react-hot-toast";
import ProductCard from "../produts/ProductCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useLocation } from "react-router-dom";
import { FiGrid } from "react-icons/fi";

const Allproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectCategory, setSelectCategory] = useState("All");
  const [showAll, setShowall] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Products"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load product data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products by category and search query
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectCategory, searchQuery]);

  const categories = ["All", ...new Set(products.map((m) => m.category))];
  const visibleProducts = showAll
    ? filteredProducts
    : filteredProducts.slice(0, 12);

  return (
    <div className="w-11/12 mx-auto">
      <div>
        <CatagoriesNav
          cetgories={categories}
          selectCategory={selectCategory}
          setSelectCategory={setSelectCategory}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-dots loading-5xl text-[#000000]"></span>
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <h2 className="text-2xl font-pop font-bold ml-2 mb-4 text-black flex items-center gap-2">
            <FiGrid className="text-blue-500" /> All Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 shadow bg-[#ffffff] p-3 rounded-2xl">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length > 12 && (
            <div className="flex justify-center mt-8">
              <button
                className="px-6 py-2 rounded-full font-medium transition-all duration-300 border border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white mb-5"
                onClick={() => setShowall(!showAll)}
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-4xl font-bold text-center text-[#000000] font-pop">
          No Products Found
        </p>
      )}
    </div>
  );
};

export default Allproducts;
