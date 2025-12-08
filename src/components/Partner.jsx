import React from "react";

// PaymentDelivery.jsx
// A responsive Tailwind React component showing payment methods and delivery partners.
// Replace the `src` values with your real logo URLs (local /assets or CDN).

export default function PaymentDelivery({ className = "" }) {
  const payments = [
    { name: "bKash", src: "https://i.ibb.co.com/XZnyd5PX/Bkash.png" },
    { name: "Nagad", src: "https://i.ibb.co.com/LDZgD3tr/nagad.png" },
    {
      name: "Rocket",
      src: "https://i.ibb.co.com/XrjX7CXS/d6621b10013ac98c8b3b3bc7a03fbf6580b5be6ab5e35898b6a7942177963e90-200.jpg",
    },
  ];

  const deliveries = [
    { name: "Pathao", src: "https://i.ibb.co.com/Kzb1kg3Q/pathao.png" },
    {
      name: "Sundarbon Courier",
      src: "https://i.ibb.co.com/n8bTVHF4/sundorbon.png",
    },
    { name: "Steedfast", src: "https://i.ibb.co.com/Y5MC72X/steadfast.jpg" },
  ];

  return (
    <section
      className={`bg-white mt-5 dark:bg-gray-900 py-10 font-pop ${className}`}
      aria-labelledby="payment-delivery-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Payment Methods */}
          <div>
            <h2
              id="payment-delivery-heading"
              className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3"
            >
              Supported Payment Methods
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Secure and easy payments — mobile wallets widely used in
              Bangladesh.
            </p>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-3">
              {payments.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-150"
                >
                  {/* If you prefer SVG inline logos, replace the <img> with the SVG. */}
                  <img
                    src={p.src}
                    alt={p.name + " logo"}
                    className="h-10 object-contain"
                  />
                </div>
              ))}
            </div>

            <ul className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <li>• Instant in-app/mobile wallet payments</li>
              <li>
                • Enter transaction ID on checkout for manual verification (if
                needed)
              </li>
            </ul>
          </div>

          {/* Delivery Partners */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Delivery Partners
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Fast and reliable couriers across Bangladesh.
            </p>

            <div className="grid grid-cols-3 gap-4 sm:grid-cols-3">
              {deliveries.map((d) => (
                <div
                  key={d.name}
                  className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:scale-105 transform-gpu transition-all duration-150"
                >
                  <img
                    src={d.src}
                    alt={d.name + " logo"}
                    className="h-10 object-contain mb-2"
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {d.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>
                Delivery times vary by location. Cash on delivery available for
                select pincodes.
              </p>
            </div>
          </div>
        </div>

        {/* Optional footnote / badges */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-green-50 dark:bg-green-900/30 rounded-full text-green-800 dark:text-green-200 text-sm font-medium">
              Trusted Partners
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Secure payouts & insured deliveries
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Questions?{" "}
            <a
              href="/contact"
              className="text-primary-600 dark:text-primary-300 underline"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
