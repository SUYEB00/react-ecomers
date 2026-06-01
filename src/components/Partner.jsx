import React from "react";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function PaymentDelivery({ className = "" }) {
  const [logos, setLogos] = useState({});

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const snap = await getDoc(doc(db, "Settings", "LogoLinks"));

        if (snap.exists()) {
          setLogos(snap.data());
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchLogos();
  }, []);

  const payments = [
    {
      name: "bKash",
      src: logos.bkash,
    },
    {
      name: "Nagad",
      src: logos.nagad,
    },
    {
      name: "Rocket",
      src: logos.rocket,
    },
    {
      name: "COD",
      src: logos.cod,
    },
  ].filter((item) => item.src);

  const deliveries = [
    {
      name: "Pathao",
      src: logos.pathao,
    },
    {
      name: "Sundarban Courier",
      src: logos.sundorban,
    },
    {
      name: "Steadfast",
      src: logos.steadfast,
    },
  ].filter((item) => item.src);

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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {payments.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-150"
                >
                  {/* If you prefer SVG inline logos, replace the <img> with the SVG. */}
                  <div className="flex flex-col items-center">
                    <img
                      src={p.src}
                      alt={p.name}
                      className="h-10 object-contain mb-2"
                    />

                    <span className="text-xs text-gray-600 dark:text-gray-300">
                      {p.name}
                    </span>
                  </div>
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
