import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // make sure your firebase config is correct

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "ContactMessages"), {
        ...form,
        date: serverTimestamp(),
      });

      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message!");
    }

    setLoading(false);
  };

  return (
    <div className="w-11/12 max-w-2xl mx-auto mt-35 font-pop">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-bold text-center text-[#ff8f9c] mb-6">
        Contact Us
      </h1>

      <p className="text-center text-gray-700 mb-6">
        Have a question or suggestion? Send us a message and we will get back to
        you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#202020]"
          required
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          type="email"
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#202020]"
          required
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#202020]"
          required
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white text-lg px-4 py-3 w-full rounded-lg shadow hover:bg-[#ff8f9c] transition"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      <div className="mt-10 text-center text-gray-600">
        <p>Email: support@trendzone.com</p>
        <p>Phone: +8801940686844</p>
        <p>Address: Sherpur Sadar, Dhaka, Bangladesh</p>
      </div>
    </div>
  );
}
