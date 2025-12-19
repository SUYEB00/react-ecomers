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
    <div className="w-11/12 max-w-3xl mx-auto mt-30 font-pop">
      <Toaster position="top-right" />

      <h1 className="text-4xl font-bold text-center mb-2">Contact Support</h1>

      <p className="text-center text-gray-600 mb-10">
        Submit a ticket and track admin replies
      </p>

      {/* FORM */}
      <div className="bg-white border rounded-2xl shadow p-6 mb-16">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-3.5 text-gray-400" />
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your Name"
              className="w-full pl-10 p-3 border rounded-xl"
              required
            />
          </div>

          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              value={email}
              disabled
              className="w-full pl-10 p-3 bg-gray-100 border rounded-xl"
            />
          </div>

          <div className="relative">
            <HiOutlineChatAlt2 className="absolute left-3 top-3.5 text-gray-400" />
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Describe your issue..."
              rows={4}
              className="w-full pl-10 p-3 border rounded-xl"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl"
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>

      {/* HISTORY */}
      {allMessages.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">🎫 Your Tickets</h2>

          {allMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white border rounded-2xl p-6 shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold flex items-center gap-2">
                  <HiOutlineTicket />
                  {msg.ticketNo}
                </p>

                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                    msg.replied
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {msg.replied ? <HiOutlineCheckCircle /> : <HiOutlineClock />}
                  {msg.replied ? "Resolved" : "Waiting"}
                </span>
              </div>

              <p className="text-gray-700">{msg.message}</p>

              {msg.replied && (
                <div className="mt-4 bg-green-50 border rounded-xl p-4">
                  <p className="font-semibold text-green-700">Admin Reply</p>
                  <p>{msg.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
