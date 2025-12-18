import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import RelatedProducts from "./RelatedProducts";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart, buyNow } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "Products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center mt-20">Product not found</div>;
  }

  // ✅ Buy Now handler
  const handleBuyNow = () => {
    buyNow({
      id: product.id,
      title: product.title,
      newprice: product.newprice,
      product_picture: product.product_picture,
      quantity: 1,
    });

    navigate("/checkout");
  };

  // ✅ Add to cart handler
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      newprice: product.newprice,
      product_picture: product.product_picture,
      quantity: 1,
    });
  };

  return (
    <>
      {/* PRODUCT DETAILS */}
      <div className="w-11/12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mt-30">
        {/* Image */}
        <img
          src={product.product_picture}
          alt={product.title}
          className="w-full rounded-xl shadow"
        />

        {/* Info */}
        <div className="font-mon">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

          <div className="flex text-yellow-400 mb-2">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>

          <div className="flex items-center gap-3 mb-4">
            {product.oldprice && (
              <span className="line-through text-gray-400">
                ৳{product.oldprice}
              </span>
            )}
            <span className="text-2xl font-bold text-black">
              ৳{product.newprice}
            </span>
          </div>

          <p className="text-gray-600 mb-6">
            {product.product_description || "No description available."}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <RelatedProducts category={product.category} currentId={product.id} />
    </>
  );
};

export default ProductDetails;
