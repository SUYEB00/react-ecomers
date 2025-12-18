import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import {
  HiOutlineChatAlt2,
  HiOutlineMail,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineReply,
} from "react-icons/hi";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  /* ---------------- FETCH ---------------- */
  const fetchMessages = async () => {
    try {
      const snapshot = await getDocs(collection(db, "ContactMessages"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch messages.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  /* ---------------- DELETE ---------------- */
  const deleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, "ContactMessages", id));
      toast.success("Message deleted!");
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete message.");
    }
  };

  /* ---------------- REPLY ---------------- */
  const sendReply = async (id) => {
    if (!replyText[id]) {
      return toast.error("Reply cannot be empty");
    }

    try {
      setLoadingId(id);

      await updateDoc(doc(db, "ContactMessages", id), {
        reply: replyText[id],
        replied: true,
        repliedAt: serverTimestamp(),
      });

      toast.success("Reply sent!");

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? { ...msg, reply: replyText[id], replied: true }
            : msg
        )
      );

      setReplyText((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.log(error);
      toast.error("Failed to send reply.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-11/12 mx-auto mt-10 font-pop">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold text-center text-black mb-2">
        Message Management
      </h1>

      <p className="text-center text-gray-500 mb-6">
        View, reply, and manage customer messages
      </p>

      <div className="mb-5 text-lg font-semibold text-gray-700">
        Total Messages:{" "}
        <span className="text-red-500 font-bold">{messages.length}</span>
      </div>

      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm"
          >
            {/* HEADER */}
            <div className="flex flex-wrap justify-between gap-4 mb-3">
              <div>
                <p className="flex items-center gap-2 font-semibold">
                  <HiOutlineUser />
                  {msg.name}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <HiOutlineMail />
                  {msg.email}
                </p>
              </div>

              <button
                onClick={() => deleteMessage(msg.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs"
              >
                <HiOutlineTrash />
                Delete
              </button>
            </div>

            {/* MESSAGE */}
            <div className="flex items-start gap-2 mb-3">
              <HiOutlineChatAlt2 className="mt-1 text-gray-400" />
              <p className="text-gray-800 whitespace-pre-wrap">
                {msg.message}
              </p>
            </div>

            {/* REPLY SECTION */}
            {msg.replied ? (
              <div className="bg-gray-50 border rounded-lg p-3">
                <p className="text-sm font-semibold mb-1">
                  Admin Reply
                </p>
                <p className="text-gray-700">{msg.reply}</p>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
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
                  className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
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
          <div className="text-center py-10 text-gray-500">
            No messages found
          </div>
        )}
      </div>
    </div>
  );
}
