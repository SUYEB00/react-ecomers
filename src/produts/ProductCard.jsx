import React from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart(); // Updated

  const handleAddToCart = () => {
    addToCart(product);
  };

  const openProduct = () => {
    navigate(`/product/${product.id}`);
  };

  const handleBuyNow = () => {
    buyNow(product); // Changed
    navigate("/checkout");
  };

  return (
    <div
      className="relative font-mon border border-gray-200 rounded-xl bg-white p-3 sm:p-3 shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:scale-105 max-w-[200px] sm:max-w-xs mx-auto"
      onClick={openProduct}
    >
      {/* Discount Circle */}
      <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full shadow-md">
        {Math.round(
          ((Number(product.oldprice) - Number(product.newprice)) /
            Number(product.oldprice)) *
            100
        )}
        %
      </div>

      <img
        src={product.product_picture}
        alt={product.title}
        className="w-full h-32 sm:h-40 object-cover rounded-lg"
      />

      <div className="mt-2">
        <h3 className="text-gray-900 font-semibold text-xs sm:text-sm truncate">
          {product.title}
        </h3>

        <div className="flex text-yellow-400 mt-1 text-xs">
          <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaRegStarHalfStroke />
        </div>

        <div className="mt-1 flex items-center gap-1">
          <p className="line-through text-gray-400 text-xs">
            ৳{product.oldprice}
          </p>
          <strong className="text-gray-900 text-sm">৳{product.newprice}</strong>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
