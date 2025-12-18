import React from "react";
import Navbar from "../components/Navbar";
import ProductDetails from "../produts/ProductDetail";
import Footer from "../components/Footer";

const ProductDetailsPage = () => {
  return (
    <div>
      <Navbar />
      <ProductDetails />
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
