import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineChatAlt2,
  HiOutlineMail,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineReply,
  HiOutlineClock,
  HiOutlineCheckCircle,
} from "react-icons/hi";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "ContactMessages"),
      orderBy("createdAtClient", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    });

    return () => unsubscribe();
  }, []);

  const deleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, "ContactMessages", id));
      toast.success("Ticket deleted");
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  const sendReply = async (id) => {
    if (!replyText[id]?.trim()) {
      return toast.error("Reply cannot be empty");
    }

    try {
      setLoadingId(id);

      await updateDoc(doc(db, "ContactMessages", id), {
        reply: replyText[id],
        replied: true,
        repliedAt: serverTimestamp(),
      });

      toast.success("Reply sent");
      setReplyText((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      toast.error("Failed to send reply");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-11/12 max-w-6xl mx-auto mt-10 font-pop">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold text-center mb-1">
        Support Ticket Management
      </h1>

      <p className="text-center text-gray-500 mb-6">
        Real-time customer support inbox
      </p>

      <div className="mb-6 text-sm font-semibold text-gray-700">
        Total Tickets:
        <span className="ml-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
          {messages.length}
        </span>
      </div>

      <div className="space-y-5">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white border rounded-2xl p-5 shadow">
            {/* HEADER */}
            <div className="flex flex-wrap justify-between gap-4 mb-3">
              <div>
                <p className="flex items-center gap-2 font-semibold">
                  <HiOutlineUser />
                  {msg.name}
                  {msg.userKey?.startsWith("guest") && (
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">
                      Guest
                    </span>
                  )}
                </p>

                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <HiOutlineMail />
                  {msg.email}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Ticket: {msg.ticketNo}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                    msg.replied
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {msg.replied ? <HiOutlineCheckCircle /> : <HiOutlineClock />}
                  {msg.replied ? "Resolved" : "Pending"}
                </span>

                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs"
                >
                  <HiOutlineTrash />
                  Delete
                </button>
              </div>
            </div>

            {/* MESSAGE */}
            <div className="flex gap-2 mb-4">
              <HiOutlineChatAlt2 className="mt-1 text-gray-400" />
              <p className="text-gray-800 whitespace-pre-wrap">{msg.message}</p>
            </div>

            {/* REPLY */}
            {msg.replied ? (
              <div className="bg-green-50 border rounded-xl p-4">
                <p className="font-semibold text-green-700 mb-1">Admin Reply</p>
                <p className="text-gray-700">{msg.reply}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  placeholder="Write reply..."
                  value={replyText[msg.id] || ""}
                  onChange={(e) =>
                    setReplyText({
                      ...replyText,
                      [msg.id]: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg text-sm focus:ring-1 focus:ring-black"
                />

                <button
                  onClick={() => sendReply(msg.id)}
                  disabled={loadingId === msg.id}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-black text-white rounded-lg text-sm"
                >
                  <HiOutlineReply />
                  {loadingId === msg.id ? "Sending..." : "Send Reply"}
                </button>
              </div>
            )}
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No support tickets yet
          </div>
        )}
      </div>
    </div>
  );
}
