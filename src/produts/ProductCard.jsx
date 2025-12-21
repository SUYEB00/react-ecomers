import React from "react";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const stockCount = Number(product.stock);
  const isOutOfStock = stockCount <= 0;

  const openProduct = () => {
    if (stockCount <= 0) return;
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className={`relative font-mon border border-gray-200 rounded-xl bg-white p-3 sm:p-3 shadow-sm max-w-[200px] min-w-[150px] lg:min-w-[180px] mx-auto
        ${
          isOutOfStock
            ? "cursor-not-allowed opacity-70"
            : "hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
        }`}
      onClick={openProduct}
    >
      {/* Discount */}
      <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full shadow-md">
        {Math.round(
          ((Number(product.oldprice) - Number(product.newprice)) /
            Number(product.oldprice)) *
            100
        )}
        %
      </div>

      {/* STOCK BADGE */}
      <div className="absolute top-1 right-1">
        <span
          className={`text-[10px] px-2 py-[2px] rounded-full text-white
            ${
              isOutOfStock
                ? "bg-gray-500"
                : product.stock <= 5
                ? "bg-orange-500"
                : "bg-green-600"
            }`}
        >
          Stock: {product.stock}
        </span>
      </div>

      <img
        src={product.product_picture}
        alt={product.title}
        className="w-full h-32 sm:h-40 object-cover rounded-lg"
      />

      <div className="mt-2">
        <h3 className="text-gray-900 font-semibold text-xs sm:text-sm">
          {product.title?.split(" ").slice(0, 2).join(" ")}
          {product.title?.split(" ").length > 2 && "..."}
        </h3>

        {product.sold !== undefined && (
          <span className="flex items-center gap-1 text-[10px] text-green-600">
            <HiOutlineBadgeCheck className="text-xs" />
            {product.sold} sold
          </span>
        )}

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
