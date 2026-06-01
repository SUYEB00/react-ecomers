import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Footer() {
  const [settings, setSettings] = useState({
    websiteName: "",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
    youtube: "",
    whatsapp: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, "Settings", "Website"));

        if (docSnap.exists()) {
          setSettings(docSnap.data());
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="bg-[#ffffff] text-[#000000] font-pop mt-5">
      <div className="w-11/12 max-w-6xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#000000] mb-3 flex items-center">
            {settings.websiteName?.trim() ? (
              settings.websiteName
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-2 h-2 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </span>
            )}
          </h2>

          <p className="text-gray-400 text-sm">
            Your one-stop shop for the latest products and trends. Quality and
            style at your fingertips.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>

          <ul className="space-y-2 text-gray-400">
            <li
              className="cursor-pointer"
              onClick={() => (window.location.href = "/")}
            >
              Home
            </li>

            <li
              className="cursor-pointer"
              onClick={() => (window.location.href = "/products")}
            >
              Products
            </li>

            <li
              className="cursor-pointer"
              onClick={() => (window.location.href = "/about")}
            >
              About
            </li>

            <li
              className="cursor-pointer"
              onClick={() => (window.location.href = "/contact")}
            >
              Contact
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>

          <p className="text-gray-400 text-sm mb-3 flex items-center gap-1">
            Email:{" "}
            {settings.email?.trim() ? (
              settings.email
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </span>
            )}
          </p>

          <p className="text-gray-400 text-sm mb-3 flex items-center gap-1">
            Phone:{" "}
            {settings.phone?.trim() ? (
              settings.phone
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </span>
            )}
          </p>

          <div className="flex gap-3 mt-3">
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white hover:bg-gray-800 transition p-2 rounded-full"
              >
                <FaFacebookF />
              </a>
            )}

            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white hover:bg-gray-800 transition p-2 rounded-full"
              >
                <FaInstagram />
              </a>
            )}

            {settings.youtube && (
              <a
                href={settings.youtube}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white hover:bg-gray-800 transition p-2 rounded-full"
              >
                <FaYoutube />
              </a>
            )}

            {settings.whatsapp && (
              <a
                href={settings.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white hover:bg-gray-800 transition p-2 rounded-full"
              >
                <FaWhatsapp />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-6 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-black inline-flex items-center">
            {settings.websiteName ? (
              settings.websiteName
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
                <span
                  className="w-2 h-2 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="w-2 h-2 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: "0.3s" }}
                />
              </span>
            )}
          </span>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
