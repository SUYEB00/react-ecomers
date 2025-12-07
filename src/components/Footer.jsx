import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#202020] text-white font-pop">
      <div className="w-11/12 max-w-6xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#ff8f9c] mb-3">TRENDZONE</h2>
          <p className="text-gray-300 text-sm">
            Your one-stop shop for the latest products and trends. Quality and
            style at your fingertips.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li
              className="hover:text-[#ff8f9c] cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              Home
            </li>
            <li
              className="hover:text-[#ff8f9c] cursor-pointer"
              onClick={() => (window.location.href = "/products")}
            >
              Products
            </li>
            <li
              className="hover:text-[#ff8f9c] cursor-pointer"
              onClick={() => (window.location.href = "/about")}
            >
              About
            </li>
            <li
              className="hover:text-[#ff8f9c] cursor-pointer"
              onClick={() => (window.location.href = "/contact")}
            >
              Contact
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          <p className="text-gray-300 text-sm mb-3">
            Email: support@trendzone.com
          </p>
          <p className="text-gray-300 text-sm mb-3">Phone: +8801940686844</p>
          <div className="flex gap-3 mt-3">
            <a
              href="#"
              className="bg-[#ff8f9c] hover:bg-white hover:text-[#ff8f9c] transition p-2 rounded-full"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="bg-[#ff8f9c] hover:bg-white hover:text-[#ff8f9c] transition p-2 rounded-full"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="bg-[#ff8f9c] hover:bg-white hover:text-[#ff8f9c] transition p-2 rounded-full"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="bg-[#ff8f9c] hover:bg-white hover:text-[#ff8f9c] transition p-2 rounded-full"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} TRENDZONE. All rights reserved.
      </div>
    </footer>
  );
}
