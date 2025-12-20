import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  HiOutlineTicket,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineChatAlt2,
} from "react-icons/hi";

export default function Contact() {
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userKey, setUserKey] = useState("");
  const [email, setEmail] = useState("guest@support.local");

  const [form, setForm] = useState({
    name: "",
    message: "",
  });

  useEffect(() => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = "guest-" + Date.now();
      localStorage.setItem("guestId", guestId);
    }
    setUserKey(guestId);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserKey(user.uid);
        setEmail(user.email);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!userKey) return;

    const q = query(
      collection(db, "ContactMessages"),
      orderBy("createdAtClient", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const userMessages = data.filter((msg) => msg.userKey === userKey);

      setAllMessages(userMessages);
    });

    return () => unsubscribe();
  }, [userKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.message) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "ContactMessages"), {
        ticketNo: `TKT-${Date.now()}`,
        name: form.name,
        email,
        message: form.message,

        reply: "",
        replied: false,

        userKey,
        createdAtClient: Date.now(),
        createdAt: serverTimestamp(),
      });

      toast.success("Ticket submitted");
      setForm({ name: form.name, message: "" });
    } catch (error) {
      toast.error("Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-[#ffffff] font-pop p-4 mt-30">
      <Toaster position="top-right" />

      <div className="w-full max-w-sm space-y-8">
        {/* CONTACT FORM CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-semibold text-center text-gray-900 mb-2">
            Contact Support
          </h1>

          <p className="text-center text-sm text-gray-600 mb-6">
            Submit a ticket and track admin replies
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-3.5 text-gray-400" />
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-black focus:outline-none transition"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-3.5 text-gray-400" />
              <input
                value={email}
                disabled
                className="w-full pl-10 p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Message */}
            <div className="relative">
              <HiOutlineChatAlt2 className="absolute left-3 top-3.5 text-gray-400" />
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your issue..."
                rows={4}
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-black focus:outline-none transition resize-none"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full p-3 rounded-xl bg-black text-white font-semibold transition disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>

          <p className="text-[13px] text-center text-gray-600 mt-5">
            Our support team usually replies within 24 hours
          </p>
        </div>

        {/* TICKET HISTORY CARD */}
        {allMessages.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-center mb-6">
              🎫 Your Tickets
            </h2>

            <div className="space-y-4">
              {allMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold flex items-center gap-2 text-sm">
                      <HiOutlineTicket />
                      {msg.ticketNo}
                    </p>

                    <span
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                        msg.replied
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {msg.replied ? (
                        <HiOutlineCheckCircle />
                      ) : (
                        <HiOutlineClock />
                      )}
                      {msg.replied ? "Resolved" : "Waiting"}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm">{msg.message}</p>

                  {msg.replied && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="font-semibold text-green-700 text-sm">
                        Admin Reply
                      </p>
                      <p className="text-sm">{msg.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
