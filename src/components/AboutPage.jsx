import React from "react";

export default function About() {
  return (
    <div className="w-11/12 max-w-4xl mx-auto mt-30 font-pop">
      <h1 className="text-4xl font-bold text-center text-[#000000] mb-6">
        About Us
      </h1>

      <div className="space-y-6 text-gray-700">
        <p className="text-lg leading-7">
          Welcome to <strong>TrendZone</strong>! We are committed to providing
          the best products and services to our valued customers. Our goal is to
          create a seamless and enjoyable shopping experience.
        </p>

        <p className="text-lg leading-7">
          Our team carefully selects high-quality products to ensure that you
          receive nothing but the best. We believe in transparency, trust, and
          customer satisfaction above all else.
        </p>

        <p className="text-lg leading-7">
          Whether you’re shopping for the latest products, exploring special
          offers, or just browsing, we are here to make your experience smooth
          and enjoyable. Your happiness is our priority!
        </p>

        <p className="text-lg leading-7">
          Thank you for choosing <strong>TrendZone</strong>. We hope to see you
          back often!
        </p>
      </div>

      <div className="mt-10 flex flex-col md:flex-row items-center justify-around gap-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-[#000000] mb-2">Our Mission</h3>
          <p className="text-gray-600">
            To provide top-quality products and ensure customer satisfaction in
            every purchase.
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-[#000000] mb-2">Our Vision</h3>
          <p className="text-gray-600">
            To become a trusted online shopping destination for customers
            worldwide.
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-[#000000] mb-2">Our Values</h3>
          <p className="text-gray-600">
            Quality, transparency, trust, and customer happiness.
          </p>
        </div>
      </div>
    </div>
  );
}
