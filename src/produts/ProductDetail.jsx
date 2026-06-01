import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaStar } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import RelatedProducts from "./RelatedProducts";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { FaShareAlt } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  const { addToCart, buyNow } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "Products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = {
            id: docSnap.id,
            ...docSnap.data(),
          };

          setProduct(productData);
          setSelectedImage(productData.product_picture);
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

  const handleBuyNow = () => {
    buyNow({
      id: product.id,
      title: product.title,
      newprice: product.newprice,
      product_picture: product.product_picture,
      quantity: 1,
      sizes: product.sizes || [],
    });

    navigate("/checkout");
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      newprice: product.newprice,
      product_picture: product.product_picture,
      quantity: 1,
      sizes: product.sizes || [],
    });
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: `Check out this product: ${product.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("Product link copied!");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <>
      {/* PRODUCT DETAILS */}
      <div className="w-11/12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mt-30">
        {/* Image */}
        <div>
          {/* Main Image */}
          <img
            src={selectedImage}
            alt={product.title}
            className="w-full rounded-xl shadow"
          />

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {[
              product.product_picture,
              product.image2,
              product.image3,
              product.image4,
            ]
              .filter(Boolean)
              .map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Product ${index + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                    selectedImage === img ? "border-black" : "border-gray-200"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Info */}
        <div className="font-mon">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">{product.title}</h1>

            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition"
            >
              <FaShareAlt />
            </button>
          </div>

          {product.sold !== undefined && (
            <span className="flex items-center gap-1 text-[15px] text-green-600">
              <HiOutlineBadgeCheck className="text-xs" />
              {product.sold} sold
            </span>
          )}

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
