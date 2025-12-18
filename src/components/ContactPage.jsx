import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Contact() {
  const [userEmail, setUserEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    message: "",
  });

  /* ------------------ AUTH + HISTORY ------------------ */
  useEffect(() => {
    let unsubscribeMessages = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      setUserEmail(user.email);

      const q = query(
        collection(db, "ContactMessages"),
        where("email", "==", user.email),
        orderBy("createdAtClient", "desc")
      );

      unsubscribeMessages = onSnapshot(q, (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
    });

    return () => {
      unsubAuth();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, []);

  /* ------------------ FORM ------------------ */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.message) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "ContactMessages"), {
        name: form.name,
        email: auth.currentUser.email,
        message: form.message,

        reply: "",
        replied: false,

        createdAt: serverTimestamp(),
        createdAtClient: Date.now(), // ✅ ADD THIS
      });

      toast.success("Message sent!");
      setForm((prev) => ({ ...prev, message: "" }));
    } catch (err) {
      toast.error("Failed to send message");
    }

    setLoading(false);
  };

  return (
    <div className="w-11/12 max-w-2xl mx-auto mt-30 font-pop">
      <Toaster position="top-right" />

      <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-3 border rounded-xl"
          required
        />

        {/* 🔒 EMAIL IS LOCKED */}
        <input
          value={userEmail}
          disabled
          className="w-full p-3 bg-gray-100 border rounded-xl cursor-not-allowed"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows={5}
          className="w-full p-3 border rounded-xl"
          required
        />

        <button
          disabled={loading}
          className="bg-black text-white w-full py-3 rounded-lg"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {/* ------------------ HISTORY ------------------ */}
      {messages.length > 0 && (
        <div className="mt-14">
          <h2 className="text-2xl font-bold text-center mb-6">
            Your Message History
          </h2>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="border rounded-xl p-4">
                <p className="font-semibold">Your Message</p>
                <p className="text-gray-700">{msg.message}</p>

                {msg.replied ? (
                  <div className="mt-3 bg-gray-50 border rounded-lg p-3">
                    <p className="font-semibold">Admin Reply</p>
                    <p>{msg.reply}</p>
                  </div>
                ) : (
                  <p className="text-sm text-orange-600 mt-2">
                    Waiting for admin reply
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
